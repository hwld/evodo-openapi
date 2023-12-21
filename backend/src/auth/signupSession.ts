import { Context } from "hono";
import { DB } from "../db";
import { eq } from "drizzle-orm";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { SIGNUP_SESSION_COOKIE } from "../features/auth/consts";
import { signupSessions } from "../db/schema";
import { alphabet, generateRandomString } from "oslo/random";
import { RouteEnv } from "../app";
import { TimeSpan, createDate } from "oslo";

export class SignupSession {
  constructor(
    private db: DB,
    private context: Context<RouteEnv>,
  ) {}

  public start = async (googleUserId: string) => {
    await this.db
      .delete(signupSessions)
      .where(eq(signupSessions.googleUserId, googleUserId));

    const id = generateRandomString(40, alphabet("a-z", "0-9"));
    const [session] = await this.db
      .insert(signupSessions)
      .values({
        id: id,
        googleUserId,
        expires: createDate(new TimeSpan(10, "m")).getTime(),
      })
      .returning();

    this.setCookie(session.id);
  };

  public validate = async () => {
    const sessionId = getCookie(this.context, SIGNUP_SESSION_COOKIE);
    if (!sessionId) {
      return null;
    }

    const session = await this.db.query.signupSessions.findFirst({
      where: eq(signupSessions.id, sessionId),
    });
    if (!session) {
      deleteCookie(this.context, SIGNUP_SESSION_COOKIE);
      return null;
    }

    if (Date.now() > session.expires) {
      await this.db
        .delete(signupSessions)
        .where(eq(signupSessions.id, sessionId));
      deleteCookie(this.context, SIGNUP_SESSION_COOKIE);
      return null;
    }

    return session;
  };

  public invalidate = async () => {
    const sessionId = getCookie(this.context, SIGNUP_SESSION_COOKIE);
    if (sessionId) {
      await this.db
        .delete(signupSessions)
        .where(eq(signupSessions.id, sessionId));
    }
    deleteCookie(this.context, SIGNUP_SESSION_COOKIE);
  };

  private setCookie = async (sessionId: string) => {
    setCookie(this.context, SIGNUP_SESSION_COOKIE, sessionId, {
      httpOnly: true,
      secure: this.context.env.ENVIRONMENT === "prod",
    });
  };
}
