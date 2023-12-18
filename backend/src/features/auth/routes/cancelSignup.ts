import { createRoute, z } from "@hono/zod-openapi";
import { Features } from "../../features";
import { cancelSignupPath } from "../path";
import { route } from "../../../app";
import { validateSignupSession } from "../../../auth/session";
import { HTTPException } from "hono/http-exception";
import { signupSessions } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { deleteCookie } from "hono/cookie";
import { SIGNUP_SESSION_COOKIE } from "../consts";

const cancelSignupRoute = createRoute({
  tags: [Features.auth],
  method: "post",
  path: cancelSignupPath,
  request: {},
  responses: {
    200: {
      description: "新規登録のキャンセルが成功",
      content: { "application/json": { schema: z.object({}) } },
    },
  },
});

export const cancelSignup = route().openapi(
  cancelSignupRoute,
  async (context) => {
    const {
      json,
      var: { db },
    } = context;

    const signupSession = await validateSignupSession(context, db);
    if (!signupSession) {
      throw new HTTPException(401);
    }

    await db
      .delete(signupSessions)
      .where(eq(signupSessions.id, signupSession.id));
    deleteCookie(context, SIGNUP_SESSION_COOKIE);

    return json({});
  },
);
