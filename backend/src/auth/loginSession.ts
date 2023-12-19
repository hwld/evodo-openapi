import { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { CookieOptions } from "hono/utils/cookie";
import { SessionCookie } from "lucia";
import { CookieAttributes } from "oslo/cookie";
import { LuciaAuth } from "./lucia";

const convertCookieAttr = (attributes: CookieAttributes): CookieOptions => {
  const sameSite = attributes.sameSite;

  return {
    ...attributes,
    sameSite:
      sameSite === "lax"
        ? "Lax"
        : sameSite === "strict"
          ? "Strict"
          : sameSite === "none"
            ? "None"
            : undefined,
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
 *  ログインセッションを検証する。
 *  セッションが無効であればセッションを削除し、Cookieもリセットする。
 *  セッションが更新されていればCookieを更新する。
 */
export const validateLoginSession = async (
  context: Context,
  auth: LuciaAuth,
) => {
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
