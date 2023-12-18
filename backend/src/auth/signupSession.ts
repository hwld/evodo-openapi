import { Context } from "hono";
import { DB } from "../db";
import { deleteCookie, getCookie } from "hono/cookie";
import { SIGNUP_SESSION_COOKIE_NAME } from "../features/auth/consts";
import { signupSessionsTable } from "../db/schema";
import { InferSelectModel, eq } from "drizzle-orm";

export const validateSignupSession = async (
  context: Context,
  db: DB,
): Promise<InferSelectModel<typeof signupSessionsTable> | undefined> => {
  const sessionId = getCookie(context, SIGNUP_SESSION_COOKIE_NAME);
  if (!sessionId) {
    return undefined;
  }

  const session = await db.query.signupSessionsTable.findFirst({
    where: eq(signupSessionsTable.id, sessionId),
  });
  if (!session) {
    return undefined;
  }

  if (Date.now() > session.expires) {
    await db
      .delete(signupSessionsTable)
      .where(eq(signupSessionsTable.id, sessionId));
    deleteCookie(context, SIGNUP_SESSION_COOKIE_NAME);
    return undefined;
  }

  return session;
};
