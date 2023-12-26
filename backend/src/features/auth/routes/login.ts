import { createRoute, z } from "@hono/zod-openapi";
import { route } from "../../../app";
import { loginPath } from "../path";
import { Features } from "../../features";
import { errorResponse } from "../../../lib/openapi";
import { setCookie } from "hono/cookie";
import {
  ERROR_REDIRECT,
  AFTER_LOGIN_REDIRECT,
  RELATIVE_PATH_REGEX,
  SIGNUP_REDIRECT,
} from "../consts";

const loginRoute = createRoute({
  tags: [Features.auth],
  method: "get",
  path: loginPath,
  summary: "GoogleのログインURLにリダイレクト",
  request: {
    // queryで受け取ったあとにset-cookieでセットして、login-callbackでそれを見てどこにリダイレクトするか決める
    // スキーマに残すためにJSONではなく個別に受け取る
    query: z.object({
      [AFTER_LOGIN_REDIRECT]: z.string().regex(RELATIVE_PATH_REGEX).optional(),
      [SIGNUP_REDIRECT]: z.string().regex(RELATIVE_PATH_REGEX).optional(),
      [ERROR_REDIRECT]: z.string().regex(RELATIVE_PATH_REGEX).optional(),
    }),
  },
  responses: {
    ...errorResponse(500),
    302: {
      description: "リダイレクト",
    },
  },
});

export const login = route(loginRoute.path).openapi(
  loginRoute,
  async (context) => {
    const {
      req,
      redirect,
      var: { auth },
    } = context;

    const { after_login_redirect, signup_redirect, error_redirect } =
      req.valid("query");

    if (after_login_redirect) {
      setCookie(context, AFTER_LOGIN_REDIRECT, after_login_redirect);
    }
    if (error_redirect) {
      setCookie(context, ERROR_REDIRECT, error_redirect);
    }
    if (signup_redirect) {
      setCookie(context, SIGNUP_REDIRECT, signup_redirect);
    }

    const url = await auth.createAuthUrl();
    return redirect(url.toString());
  },
);
