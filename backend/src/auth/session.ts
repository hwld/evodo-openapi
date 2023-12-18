import { Context } from "hono";
import { DB } from "../db";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import {
  LOGIN_SESSION_COOKIE,
  SIGNUP_SESSION_COOKIE,
} from "../features/auth/consts";
import { sessions, signupSessions } from "../db/schema";
import { InferSelectModel, eq } from "drizzle-orm";
import { LuciaAuth } from "./lucia";
import { SessionCookie } from "lucia";
import { convertCookieAttr } from "./utils";

export const setSessionCookie = async (
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

export const validateLoginSession = async (
  context: Context,
  auth: LuciaAuth,
  db: DB,
) => {
  const id = getCookie(context, LOGIN_SESSION_COOKIE);
  if (!id) {
    return { session: null, user: null };
  }

  const { session, user } = await auth.validateSession(id);
  if (!session) {
    await db.delete(sessions).where(eq(sessions.id, id));
    deleteCookie(context, LOGIN_SESSION_COOKIE);
    return { session: null, user: null };
  }

  return { session, user };
};

export const validateSignupSession = async (
  context: Context,
  db: DB,
): Promise<InferSelectModel<typeof signupSessions> | null> => {
  const sessionId = getCookie(context, SIGNUP_SESSION_COOKIE);
  if (!sessionId) {
    return null;
  }

  const session = await db.query.signupSessions.findFirst({
    where: eq(signupSessions.id, sessionId),
  });
  if (!session) {
    deleteCookie(context, SIGNUP_SESSION_COOKIE);
    return null;
  }

  if (Date.now() > session.expires) {
    await db.delete(signupSessions).where(eq(signupSessions.id, sessionId));
    deleteCookie(context, SIGNUP_SESSION_COOKIE);
    return null;
  }

  return session;
};
