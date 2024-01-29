import {
  Adapter,
  DatabaseSession,
  DatabaseUser,
  RegisteredDatabaseUserAttributes,
} from "lucia";
import { DB } from "../db";
import { eq } from "drizzle-orm";
import { users } from "../db/schema";

type UserSessionMetadata = { sessionId: string };

/**
 * userのstoreにD1を使用して、sessionのstoreにKVを使用するAdsapter
 */
export class AuthAdapter implements Adapter {
  static sessionKeyPrefix = "session:" as const;
  static userSessionKeyPrefix = "user_session:" as const;

  constructor(
    private db: DB,
    private kv: KVNamespace,
  ) {}

  public getSessionAndUser = async (
    sessionId: string,
  ): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> => {
    const session = await this.getSession(sessionId);
    if (!session) {
      return [null, null];
    }

    const userId = session.userId;
    const rawUser = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    if (!rawUser) {
      return [session, null];
    }
    const user = this.transformIntoDatabaseUser(rawUser);

    return [session, user];
  };

  private transformIntoDatabaseUser = (
    raw: RegisteredDatabaseUserAttributes & { id: string },
  ): DatabaseUser => {
    const { id, ...attributes } = raw;

    return {
      id,
      attributes,
    };
  };

  public getUserSessions = async (
    userId: string,
  ): Promise<DatabaseSession[]> => {
    const userSessionIds = await this.getUserSessionIds(userId);

    const sessionData = await Promise.all(
      userSessionIds.map((id) => this.getSession(id)),
    );

    const sessions = sessionData.filter(
      (val): val is DatabaseSession => val !== null,
    );

    return sessions;
  };

  public setSession = async (session: DatabaseSession): Promise<void> => {
    await Promise.all([
      // KVのlistがkeyとmetadataのリストしか取得してくれないので、
      // userIdをkeyにしてsessionIdを取り出しやすくするためにmetadataに格納する。
      // https://developers.cloudflare.com/kv/api/list-keys/#list-method
      this.kv.put(
        `${this.userSessionKey(session.userId, session.id)}`,
        "user_session",
        {
          metadata: { sessionId: session.id } satisfies UserSessionMetadata,
          expiration: session.expiresAt.getTime() / 1000,
        },
      ),
      this.kv.put(this.sessionKey(session.id), JSON.stringify(session), {
        expiration: session.expiresAt.getTime() / 1000,
      }),
    ]);
  };

  public updateSessionExpiration = async (
    sessionId: string,
    expiresAt: Date,
  ): Promise<void> => {
    const session = await this.getSession(sessionId);
    if (!session) {
      return;
    }

    const updatedSession: DatabaseSession = { ...session, expiresAt };
    await Promise.all([
      this.kv.put(this.sessionKey(session.id), JSON.stringify(updatedSession), {
        expiration: session.expiresAt.getTime() / 1000,
      }),
      this.kv.put(
        this.userSessionKey(session.userId, session.id),
        "user_session",
        {
          metadata: { sessionId: session.id } satisfies UserSessionMetadata,
          expiration: session.expiresAt.getTime() / 1000,
        },
      ),
    ]);
  };

  public deleteSession = async (sessionId: string): Promise<void> => {
    const session = await this.getSession(sessionId);
    if (!session) {
      return;
    }

    await Promise.all([
      this.kv.delete(this.userSessionKey(session.userId, session.id)),
      this.kv.delete(this.sessionKey(session.id)),
    ]);
  };

  public deleteUserSessions = async (userId: string): Promise<void> => {
    const userSessionIds = await this.getUserSessionIds(userId);
    await Promise.all([
      ...userSessionIds
        .map((id) => [
          this.kv.delete(this.sessionKey(id)),
          this.kv.delete(this.userSessionKey(userId, id)),
        ])
        .flat(),
    ]);
  };

  public deleteExpiredSessions = async (): Promise<void> => {
    let deletePromises: Promise<void>[] = [];
    let cursor: string | undefined;

    while (true) {
      const value = await this.kv.list(cursor ? { cursor } : undefined);

      deletePromises.push(
        ...value.keys
          .filter((key) => key.expiration && key.expiration < Date.now() / 1000)
          .map((key) => this.kv.delete(key.name)),
      );

      if (value.list_complete) {
        break;
      }
      cursor = value.cursor;
    }

    await Promise.all(deletePromises);
  };

  private getSession = async (
    sessionId: string,
  ): Promise<DatabaseSession | null> => {
    const sessionData = await this.kv.get(this.sessionKey(sessionId));
    if (!sessionData) {
      return null;
    }

    return this.transformIntoDatabaseSession(sessionData);
  };

  private transformIntoDatabaseSession = (
    sessionString: string,
  ): DatabaseSession => {
    const rawSession = JSON.parse(sessionString);
    return {
      id: rawSession.id,
      userId: rawSession.userId,
      expiresAt: new Date(rawSession.expiresAt),
      attributes: { ...rawSession.attributes },
    };
  };

  private getUserSessionIds = async (userId: string): Promise<string[]> => {
    const { keys: userSessionKeys } = await this.kv.list<UserSessionMetadata>({
      prefix: this.userSessionKey(userId, ""),
    });

    return userSessionKeys
      .map((key) => key.metadata?.sessionId)
      .filter((id): id is string => id !== undefined);
  };

  private sessionKey = (sessionId: string) => {
    return `${AuthAdapter.sessionKeyPrefix}${sessionId}`;
  };

  private userSessionKey = (userId: string, sessionId: string) => {
    return `${AuthAdapter.userSessionKeyPrefix}${userId}:${sessionId}`;
  };
}
