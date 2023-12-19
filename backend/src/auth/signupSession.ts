import { Context } from "hono";
import { DB } from "../db";
import { InferSelectModel, eq } from "drizzle-orm";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { SIGNUP_SESSION_COOKIE } from "../features/auth/consts";
import { signupSessions } from "../db/schema";
import { alphabet, generateRandomString } from "oslo/random";
import { Bindings } from "../app";

export const createSignupSession = async (db: DB, googleUserId: string) => {
  await db
    .delete(signupSessions)
    .where(eq(signupSessions.googleUserId, googleUserId));

  const id = generateRandomString(40, alphabet("a-z", "0-9"));
  const session = await db
    .insert(signupSessions)
    .values({
      id: id,
      googleUserId,
      expires: new Date().getTime() + 1000 * 60 * 30,
    })
    .returning();

  return session[0];
};

export const setSignupSessionCookie = async (
  context: Context,
  sessionId: string,
  env: Bindings,
) => {
  setCookie(context, SIGNUP_SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: env.ENVIRONMENT === "prod",
  });
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

export const invalidateSignupSession = async (
  context: Context,
  sessionId: string,
  db: DB,
) => {
  await db.delete(signupSessions).where(eq(signupSessions.id, sessionId));
  deleteCookie(context, SIGNUP_SESSION_COOKIE);
};
