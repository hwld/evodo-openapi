import { setCookie } from "hono/cookie";
import { createRoute } from "@hono/zod-openapi";
import { route } from "../../../app";
import { loginPath } from "../path";
import { Features } from "../../features";
import { CODE_VERIFIER_COOKIE, STATE_COOKIE } from "../consts";
import { generateCodeVerifier, generateState } from "arctic";
import { CookieOptions } from "hono/utils/cookie";

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

  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = await googleAuth.createAuthorizationURL(state, codeVerifier);

  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: env.ENVIRONMENT === "prod",
    path: "/",
    maxAge: 60 * 10,
  };
  setCookie(context, STATE_COOKIE, state, cookieOptions);
  setCookie(context, CODE_VERIFIER_COOKIE, codeVerifier, cookieOptions);
  return redirect(url.toString());
});
