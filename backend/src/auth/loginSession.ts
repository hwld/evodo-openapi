import { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { CookieOptions } from "hono/utils/cookie";
import { SessionCookie } from "lucia";
import { CookieAttributes } from "oslo/cookie";
import { Auth } from "./lucia";

const convertCookieAttr = (attributes: CookieAttributes): CookieOptions => {
  const sameSite = attributes.sameSite;
  const map = { lax: "Lax", strict: "Strict", none: "None" } as const;

  return {
    ...attributes,
    sameSite: sameSite && map[sameSite],
  };
};

export const setLoginSessionCookie = (
  context: Context,
  sessionCookie: SessionCookie,
) => {
  setCookie(
    context,
    sessionCookie.name,
    sessionCookie.value,
    convertCookieAttr(sessionCookie.attributes),
  );
};

/**
 * @summary
 * ログインセッションを検証する。
 *
 * @description
 * セッションが無効であればセッションを削除し、Cookieもリセットする。
 * セッションが更新されていればCookieを更新する。
 */
export const validateLoginSession = async (context: Context, auth: Auth) => {
  const id = getCookie(context, auth.sessionCookieName);
  if (!id) {
    return { session: null, user: null };
  }
  const { session, user } = await auth.validateSession(id);
  if (!session) {
    setLoginSessionCookie(context, auth.createBlankSessionCookie());
    return { session: null, user: null };
  }

  // 有効期限が延長されたらcookieを作り直す
  if (session.fresh) {
    setLoginSessionCookie(context, auth.createSessionCookie(session.id));
  }

  return { session, user };
};

/**
 * @summary
 * ログインセッションを無効にする。
 *
 * @description
 * セッションストレージからセッションを削除して、クッキーをリセットする。
 */
export const invalidateLoginSession = async (
  context: Context,
  auth: Auth,
  sessionId: string,
) => {
  await auth.invalidateSession(sessionId);
  setLoginSessionCookie(context, auth.createBlankSessionCookie());
};
