import { Context } from "hono";
import { DB } from "../db";
import { eq } from "drizzle-orm";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { SIGNUP_SESSION_COOKIE } from "../features/auth/consts";
import { signupSessions } from "../db/schema";
import { alphabet, generateRandomString } from "oslo/random";
import { Env } from "../app";

export class SignupSession {
  constructor(
    private db: DB,
    private context: Context<Env>,
  ) {}

  public start = async (googleUserId: string) => {
    await this.db
      .delete(signupSessions)
      .where(eq(signupSessions.googleUserId, googleUserId));

    const id = generateRandomString(40, alphabet("a-z", "0-9"));
    const session = await this.db
      .insert(signupSessions)
      .values({
        id: id,
        googleUserId,
        expires: new Date().getTime() + 1000 * 60 * 30,
      })
      .returning();

    this.setCookie(session[0].id);
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
