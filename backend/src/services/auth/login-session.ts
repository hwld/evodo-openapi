import { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { CookieOptions } from "hono/utils/cookie";
import { Cookie } from "lucia";
import { CookieAttributes } from "oslo/cookie";
import { AppLucia } from "./auth";
import { log } from "../logger";
import { defaultCookieOptions } from "../../lib/cookie";
import { AppBindings } from "../../app";

export class LoginSession {
  constructor(
    private context: Context,
    private env: AppBindings,
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
      log.debug("セッションCookieが存在しない");
      return { session: null, user: null };
    }

    const { session, user } = await this.lucia.validateSession(id);
    if (!session) {
      log.debug("指定されたidのセッション情報が存在しない");
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

  private setCookie = (sessionCookie: Cookie) => {
    setCookie(this.context, sessionCookie.name, sessionCookie.value, {
      ...this.convertCookieAttr(sessionCookie.attributes),
      ...defaultCookieOptions(this.env.ENVIRONMENT === "prod"),
    });
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
