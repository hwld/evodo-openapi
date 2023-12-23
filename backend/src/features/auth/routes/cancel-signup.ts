import { createRoute, z } from "@hono/zod-openapi";
import { Features } from "../../features";
import { cancelSignupPath } from "../path";
import { route } from "../../../app";
import { SIGNUP_SESSION_COOKIE } from "../consts";
import { errorResponse } from "../../../lib/openapi";

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

export const cancelSignup = route(cancelSignupRoute.path).openapi(
  cancelSignupRoute,
  async ({ json, var: { auth } }) => {
    await auth.signupSession.invalidate();
    return json({});
  },
);
