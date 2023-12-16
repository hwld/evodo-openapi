import { setCookie } from "hono/cookie";
import { createRoute, z } from "@hono/zod-openapi";
import { route } from "../../../app";
import { loginPath } from "../path";
import { Features } from "../../features";
import { OAUTH_STATE_COOKIE_NAME } from "../consts";

const loginRoute = createRoute({
  tags: [Features.auth],
  method: "get",
  path: loginPath,
  responses: {
    302: {
      description: "GoogleのログインURLにリダイレクト",
    },
  },
});

export const login = route().openapi(loginRoute, async (context) => {
  const {
    env,
    var: { googleAuth },
    redirect,
  } = context;

  const [url, state] = await googleAuth.getAuthorizationUrl();
  setCookie(context, OAUTH_STATE_COOKIE_NAME, state, {
    httpOnly: true,
    secure: env.ENVIRONMENT === "prod",
    path: "/",
    maxAge: 60 * 60,
  });

  return redirect(url.toString());
});
