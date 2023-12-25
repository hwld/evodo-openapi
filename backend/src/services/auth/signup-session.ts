import { Context } from "hono";
import { DB } from "../db";
import { eq } from "drizzle-orm";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { SIGNUP_SESSION_COOKIE } from "../../features/auth/consts";
import { signupSessions } from "../db/schema";
import { alphabet, generateRandomString } from "oslo/random";
import { TimeSpan, createDate } from "oslo";
import { AppBindings } from "../../app";
import { log } from "../logger";

export class SignupSession {
  constructor(
    private context: Context,
    private env: AppBindings,
    private db: DB,
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
      log.debug("セッションCookieが存在しない");
      return null;
    }

    const session = await this.db.query.signupSessions.findFirst({
      where: eq(signupSessions.id, sessionId),
    });
    if (!session) {
      log.debug("指定されたidのセッション情報が存在しない");
      deleteCookie(this.context, SIGNUP_SESSION_COOKIE);
      return null;
    }

    if (Date.now() > session.expires) {
      log.debug("指定されたidのセッションの期限が切れている");
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
      secure: this.env.ENVIRONMENT === "prod",
    });
  };
}
