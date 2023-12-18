import { createRoute, z } from "@hono/zod-openapi";
import { Features } from "../../features";
import { signupPath } from "../path";
import { route } from "../../../app";
import { deleteCookie } from "hono/cookie";
import { SIGNUP_SESSION_COOKIE } from "../consts";
import { HTTPException } from "hono/http-exception";
import { signupSessions, users } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { setSessionCookie, validateSignupSession } from "../../../auth/session";
import { alphabet, generateRandomString } from "oslo/random";

const SignupInput = z
  .object({
    username: z.string().min(1).max(100),
    profile: z.string().max(1000),
  })
  .openapi("SignupInput");

const signupRoute = createRoute({
  tags: [Features.auth],
  method: "post",
  path: signupPath,
  request: {
    cookies: z.object({ [SIGNUP_SESSION_COOKIE]: z.string() }),
    body: {
      content: {
        "application/json": {
          schema: SignupInput,
        },
      },
    },
  },
  responses: {
    200: {
      description: "新規登録成功",
      content: {
        "application/json": {
          schema: z.object({ userId: z.string() }),
        },
      },
    },
    400: { description: "不正なリクエスト" },
  },
});

export const signup = route().openapi(signupRoute, async (context) => {
  const {
    json,
    req,
    var: { auth, db },
  } = context;

  const signupSession = await validateSignupSession(context, db);
  if (!signupSession) {
    throw new HTTPException(401);
  }

  const { username: name, profile } = req.valid("json");
  const newUser = (
    await db
      .insert(users)
      .values({
        id: generateRandomString(15, alphabet("a-z", "0-9")),
        name,
        profile,
        googleId: signupSession.googleUserId,
      })
      .returning()
  )[0];

  const session = await auth.createSession(newUser.id, {});
  const sessionCookie = auth.createSessionCookie(session.id);
  setSessionCookie(context, sessionCookie);

  await db
    .delete(signupSessions)
    .where(eq(signupSessions.id, signupSession.id));
  deleteCookie(context, SIGNUP_SESSION_COOKIE);

  return json({ userId: newUser.id });
});
