import { createRoute, z } from "@hono/zod-openapi";
import { route } from "../../../app";
import { loginCallbackPath } from "../path";
import { Features } from "../../features";
import { STATE_COOKIE, CODE_VERIFIER_COOKIE } from "../consts";
import { HTTPException } from "hono/http-exception";
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
      [STATE_COOKIE]: z.string(),
      [CODE_VERIFIER_COOKIE]: z.string(),
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
  async ({ redirect, req, var: { auth, db }, env }) => {
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
        return redirect(`${env.CLIENT_URL}/auth/signup`);
      }

      await auth.loginSession.start(existingUser.id);

      return redirect(env.CLIENT_URL);
    } catch (e) {
      if (e instanceof OAuth2RequestError) {
        log.error("認可コードの検証に失敗しました");
        throw new HTTPException(401);
      }
      throw e;
    }
  },
);
