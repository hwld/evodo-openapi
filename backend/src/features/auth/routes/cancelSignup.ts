import { createRoute, z } from "@hono/zod-openapi";
import { Features } from "../../features";
import { cancelSignupPath } from "../path";
import { route } from "../../../app";
import { deleteCookie, getCookie } from "hono/cookie";
import { SIGNUP_SESSION_COOKIE } from "../consts";
import { invalidateSignupSession } from "../../../auth/signupSession";
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
      var: { db },
    } = context;

    const sessionId = getCookie(context, SIGNUP_SESSION_COOKIE);
    deleteCookie(context, SIGNUP_SESSION_COOKIE);
    if (!sessionId) {
      return json({});
    }

    invalidateSignupSession(context, sessionId, db);
    return json({});
  },
);
