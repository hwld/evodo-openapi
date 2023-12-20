import { createRoute, z } from "@hono/zod-openapi";
import { Features } from "../../features";
import { cancelSignupPath } from "../path";
import { route } from "../../../app";
import { SIGNUP_SESSION_COOKIE } from "../consts";
import { errorResponse } from "../../../lib/openapi";
import { authRoute } from "..";

const cancelSignupRoute = createRoute({
  tags: [Features.auth],
  method: "post",
  path: cancelSignupPath,
  summary: "新規登録をキャンセルする",
  description: "新規登録セッションを破棄して新規登録をキャンセルする",
  request: {
    cookies: z.object({
      [SIGNUP_SESSION_COOKIE]: z.string(),
    }),
  },
  responses: {
    ...errorResponse(400),
    ...errorResponse(500),
    200: {
      description: "キャンセル成功",
      content: { "application/json": { schema: z.object({}) } },
    },
  },
});

export const cancelSignup = route().openapi(
  cancelSignupRoute,
  async (context) => {
    const {
      json,
      var: { auth },
    } = context;

    const session = await auth.signupSession.validate();
    if (session) {
      await auth.signupSession.invalidate(session.id);
    }

    return json({});
  },
);
