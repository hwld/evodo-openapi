import { createRoute } from "@hono/zod-openapi";
import { route } from "../../../app";
import { loginCallbackPath } from "../path";
import { Features } from "../../features";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { alphabet, generateRandomString } from "oslo/random";
import {
  SIGNUP_SESSION_COOKIE,
  STATE_COOKIE,
  CODE_VERIFIER_COOKIE,
} from "../consts";
import { HTTPException } from "hono/http-exception";
import { eq } from "drizzle-orm";
import { decodeIdToken } from "../../../auth/utils";
import { signupSessions, users } from "../../../db/schema";
import { OAuth2RequestError } from "arctic";
import { setSessionCookie } from "../../../auth/session";

const authCallbackRoute = createRoute({
  tags: [Features.auth],
  method: "get",
  path: loginCallbackPath,
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

    const stateCookie = getCookie(context, STATE_COOKIE);
    deleteCookie(context, STATE_COOKIE);

    const codeVerifierCookie = getCookie(context, CODE_VERIFIER_COOKIE);
    deleteCookie(context, CODE_VERIFIER_COOKIE);

    const { code, state } = req.query();

    if (
      !stateCookie ||
      !codeVerifierCookie ||
      !code ||
      !state ||
      stateCookie !== state
    ) {
      throw new HTTPException(400, { message: "Bad request" });
    }
    try {
      const tokens = await googleAuth.validateAuthorizationCode(
        code,
        codeVerifierCookie,
      );

      // https://developers.google.com/identity/openid-connect/openid-connect?hl=ja#an-id-tokens-payload
      const { sub: googleId } = decodeIdToken<{ sub: string }>(tokens.idToken);
      const existingUser = await db.query.users.findFirst({
        where: eq(users.googleId, googleId),
      });

      // 新規登録のユーザーは新規登録セッションを作成してsignupページにリダイレクトする
      if (!existingUser) {
        const existingSignupSession = await db.query.signupSessions.findFirst({
          where: eq(signupSessions.googleUserId, googleId),
        });

        let signupSessionId = existingSignupSession?.id ?? "";

        if (!existingSignupSession) {
          signupSessionId = generateRandomString(40, alphabet("a-z", "0-9"));
          await db.insert(signupSessions).values({
            id: signupSessionId,
            googleUserId: googleId,
            // 有効期限を30分にする
            expires: new Date().getTime() + 1000 * 60 * 30,
          });
        }

        setCookie(context, SIGNUP_SESSION_COOKIE, signupSessionId, {
          httpOnly: true,
          secure: env.ENVIRONMENT === "prod",
        });
        return context.redirect(`${env.CLIENT_URL}/auth/signup`);
      }

      const session = await auth.createSession(existingUser.id, {});
      const sessionCookie = auth.createSessionCookie(session.id);
      setSessionCookie(context, sessionCookie);

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
