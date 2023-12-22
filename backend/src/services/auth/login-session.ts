import { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { CookieOptions } from "hono/utils/cookie";
import { SessionCookie } from "lucia";
import { CookieAttributes } from "oslo/cookie";
import { AppLucia } from "./auth";

export class LoginSession {
  constructor(
    private context: Context,
    private lucia: AppLucia,
  ) {}

  /**
   * セッションを作成して、cookieにセットする
   */
  public start = async (userId: string) => {
    const session = await this.lucia.createSession(userId, {});
    const sessionCookie = this.lucia.createSessionCookie(session.id);

    this.setCookie(sessionCookie);
  };

  public validate = async () => {
    const id = getCookie(this.context, this.lucia.sessionCookieName);
    if (!id) {
      return { session: null, user: null };
    }

    const { session, user } = await this.lucia.validateSession(id);
    if (!session) {
      this.setCookie(this.lucia.createBlankSessionCookie());
      return { session: null, user: null };
    }

    // 有効期限が延長されたらcookieを作り直す
    if (session.fresh) {
      this.setCookie(this.lucia.createSessionCookie(session.id));
    }

    return { session, user };
  };

  public invalidate = async () => {
    const sessionId = getCookie(this.context, this.lucia.sessionCookieName);
    if (sessionId) {
      await this.lucia.invalidateSession(sessionId);
    }
    this.setCookie(this.lucia.createBlankSessionCookie());
  };

  private setCookie = (sessionCookie: SessionCookie) => {
    setCookie(
      this.context,
      sessionCookie.name,
      sessionCookie.value,
      this.convertCookieAttr(sessionCookie.attributes),
    );
  };

  private convertCookieAttr = (attributes: CookieAttributes): CookieOptions => {
    const sameSite = attributes.sameSite;
    const map = { lax: "Lax", strict: "Strict", none: "None" } as const;

    return {
      ...attributes,
      sameSite: sameSite && map[sameSite],
    };
  };
}
