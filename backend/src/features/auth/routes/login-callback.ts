import { createRoute, z } from "@hono/zod-openapi";
import { route } from "../../../app";
import { loginCallbackPath } from "../path";
import { Features } from "../../features";
import {
  STATE_COOKIE,
  CODE_VERIFIER_COOKIE,
  AFTER_LOGIN_REDIRECT,
  SIGNUP_REDIRECT,
  ERROR_REDIRECT,
  RELATIVE_PATH_REGEX,
} from "../consts";
import { eq } from "drizzle-orm";
import { decodeIdToken } from "../../../services/auth/utils";
import { users } from "../../../services/db/schema";
import { OAuth2RequestError } from "arctic";
import { errorResponse } from "../../../lib/openapi";
import { log } from "../../../services/logger";

const authCallbackRoute = createRoute({
  tags: [Features.auth],
  method: "get",
  path: loginCallbackPath,
  summary: "Googleから認可コードが渡されるログイン用コールバック",
  description: `ユーザーが登録されていればログインセッションを作成し、ログイン後の画面にリダイレクトする。  
    ユーザーが登録されていなければ新規登録セッションを作成し、新規登録画面にリダイレクトする。  
    ※ユーザーからは呼び出さない。`,
  request: {
    cookies: z.object({
      [STATE_COOKIE]: z.string().optional(),
      [CODE_VERIFIER_COOKIE]: z.string().optional(),

      [AFTER_LOGIN_REDIRECT]: z.string().regex(RELATIVE_PATH_REGEX).optional(),
      [SIGNUP_REDIRECT]: z.string().regex(RELATIVE_PATH_REGEX).optional(),
      [ERROR_REDIRECT]: z.string().regex(RELATIVE_PATH_REGEX).optional(),
    }),
    query: z.object({
      code: z.string(),
      state: z.string(),
    }),
  },
  responses: {
    ...errorResponse(400),
    ...errorResponse(401),
    ...errorResponse(500),
    302: {
      description: "リダイレクト",
    },
  },
});

export const loginCallback = route(authCallbackRoute.path).openapi(
  authCallbackRoute,
  async (context) => {
    const {
      redirect,
      req,
      var: { auth, db },
      env,
    } = context;

    const { after_login_redirect, signup_redirect, error_redirect } =
      req.valid("cookie");

    try {
      const tokens = await auth.validateAuthorizationCode(req);

      // https://developers.google.com/identity/openid-connect/openid-connect?hl=ja#an-id-tokens-payload
      const { sub: googleId } = decodeIdToken<{ sub: string }>(tokens.idToken);
      const existingUser = await db.query.users.findFirst({
        where: eq(users.googleId, googleId),
      });

      // 新規登録のユーザーは新規登録セッションを作成してsignupページにリダイレクトする
      if (!existingUser) {
        await auth.signupSession.start(googleId);
        return redirect(`${env.CLIENT_URL}${signup_redirect ?? ""}`);
      }

      await auth.loginSession.start(existingUser.id);

      return redirect(`${env.CLIENT_URL}${after_login_redirect ?? ""}`);
    } catch (e) {
      if (e instanceof OAuth2RequestError) {
        log.error("認可コードの検証に失敗しました");
      }
      // エラーページに飛ばす
      return redirect(`${env.CLIENT_URL}${error_redirect ?? ""}`);
    }
  },
);
