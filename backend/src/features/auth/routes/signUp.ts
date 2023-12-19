import { createRoute, z } from "@hono/zod-openapi";
import { Features } from "../../features";
import { signupPath } from "../path";
import { route } from "../../../app";
import { SIGNUP_SESSION_COOKIE } from "../consts";
import { HTTPException } from "hono/http-exception";
import { users } from "../../../db/schema";
import {
  invalidateSignupSession,
  validateSignupSession,
} from "../../../auth/signupSession";
import { setLoginSessionCookie } from "../../../auth/loginSession";
import { errorResponse } from "../../../lib/openapi";

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
  summary: "新規登録を行う",
  request: {
    cookies: z.object({
      [SIGNUP_SESSION_COOKIE]: z.string(),
    }),
    body: {
      content: {
        "application/json": {
          schema: SignupInput,
        },
      },
    },
  },
  responses: {
    ...errorResponse(500),
    ...errorResponse(400),
    ...errorResponse(401),
    200: {
      description: "新規登録成功",
      content: {
        "application/json": {
          schema: z.object({ userId: z.string() }),
        },
      },
    },
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
    console.error("新規登録セッションが存在しない");
    throw new HTTPException(401);
  }

  const { username: name, profile } = req.valid("json");
  const newUser = (
    await db
      .insert(users)
      .values({ name, profile, googleId: signupSession.googleUserId })
      .returning()
  )[0];

  const session = await auth.createSession(newUser.id, {});
  const sessionCookie = auth.createSessionCookie(session.id);
  setLoginSessionCookie(context, sessionCookie);

  await invalidateSignupSession(context, signupSession.id, db);

  return json({ userId: newUser.id });
});
