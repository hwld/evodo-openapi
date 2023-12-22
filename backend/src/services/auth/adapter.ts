import {
  Adapter,
  DatabaseSession,
  DatabaseUser,
  DatabaseUserAttributes,
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
    raw: DatabaseUserAttributes & { id: string },
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
      // KVがkeyとmetadataのリストしか取得してくれないので、
      // userIdをkeyにしてsessionIdを取り出しやすくするためにmetadataに格納する。
      // https://developers.cloudflare.com/kv/api/list-keys/#list-method
      this.kv.put(
        `${this.userSessionKey(session.userId, session.id)}`,
        "user_session",
        {
          metadata: { sessionId: session.id } satisfies UserSessionMetadata,
        },
      ),
      this.kv.put(this.sessionKey(session.id), JSON.stringify(session)),
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
    await this.kv.put(
      this.sessionKey(session.id),
      JSON.stringify(updatedSession),
    );
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
