import { createRoute, z } from "@hono/zod-openapi";
import { route } from "../../../app";
import { loginCallbackPath } from "../path";
import { Features } from "../../features";
import { deleteCookie } from "hono/cookie";
import { STATE_COOKIE, CODE_VERIFIER_COOKIE } from "../consts";
import { HTTPException } from "hono/http-exception";
import { eq } from "drizzle-orm";
import { decodeIdToken } from "../../../auth/utils";
import { users } from "../../../db/schema";
import { OAuth2RequestError } from "arctic";
import { setLoginSessionCookie } from "../../../auth/loginSession";
import {
  createSignupSession,
  setSignupSessionCookie,
} from "../../../auth/signupSession";

const authCallbackRoute = createRoute({
  tags: [Features.auth],
  method: "get",
  path: loginCallbackPath,
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
    302: {
      description: "リダイレクト",
    },
  },
});

export const loginCallback = route().openapi(
  authCallbackRoute,
  async (context) => {
    const {
      req,
      var: { googleAuth, auth, db },
      env,
    } = context;

    const { state: stateCookie, code_verifier: codeCookie } =
      req.valid("cookie");
    const { code, state } = req.valid("query");
    deleteCookie(context, STATE_COOKIE);
    deleteCookie(context, CODE_VERIFIER_COOKIE);

    if (stateCookie !== state) {
      throw new HTTPException(400, { message: "Bad request" });
    }

    try {
      const tokens = await googleAuth.validateAuthorizationCode(
        code,
        codeCookie,
      );

      // https://developers.google.com/identity/openid-connect/openid-connect?hl=ja#an-id-tokens-payload
      const { sub: googleId } = decodeIdToken<{ sub: string }>(tokens.idToken);
      const existingUser = await db.query.users.findFirst({
        where: eq(users.googleId, googleId),
      });

      // 新規登録のユーザーは新規登録セッションを作成してsignupページにリダイレクトする
      if (!existingUser) {
        const signupSession = await createSignupSession(db, googleId);
        setSignupSessionCookie(context, signupSession.id, env);

        return context.redirect(`${env.CLIENT_URL}/auth/signup`);
      }

      const session = await auth.createSession(existingUser.id, {});
      const sessionCookie = auth.createSessionCookie(session.id);
      setLoginSessionCookie(context, sessionCookie);

      return context.redirect(env.CLIENT_URL);
    } catch (e) {
      console.error(e);
      if (e instanceof OAuth2RequestError) {
        throw new HTTPException(400);
      }
      throw e;
    }
  },
);
