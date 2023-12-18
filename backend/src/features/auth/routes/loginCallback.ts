import { createRoute } from "@hono/zod-openapi";
import { route } from "../../../app";
import { loginCallbackPath } from "../path";
import { Features } from "../../features";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { SIGNUP_SESSION_COOKIE_NAME, OAUTH_STATE_COOKIE_NAME } from "../consts";
import { OAuthRequestError } from "@lucia-auth/oauth";
import { HTTPException } from "hono/http-exception";
import { signupSessionsTable } from "../../../db/schema";
import { generateRandomString } from "lucia/utils";
import { eq } from "drizzle-orm";

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

    const storedState = getCookie(context, OAUTH_STATE_COOKIE_NAME);
    const { code, state } = req.query();

    if (!storedState || !state || storedState !== state) {
      throw new HTTPException(400, { message: "Bad request" });
    }

    try {
      const { getExistingUser, googleUser } =
        await googleAuth.validateCallback(code);
      const existingUser = await getExistingUser();

      // 新規登録のユーザーは新規登録セッションを作成してsignupページにリダイレクトする
      if (!existingUser) {
        const existingSignupSession =
          await db.query.signupSessionsTable.findFirst({
            where: eq(signupSessionsTable.googleUserId, googleUser.sub),
          });

        let signupSessionId = existingSignupSession?.id ?? "";

        if (!existingSignupSession) {
          signupSessionId = generateRandomString(40);
          await db.insert(signupSessionsTable).values({
            id: signupSessionId,
            googleUserId: googleUser.sub,
            // 有効期限を30分にする
            expires: new Date().getTime() + 1000 * 60 * 30,
          });
        }

        setCookie(context, SIGNUP_SESSION_COOKIE_NAME, signupSessionId, {
          httpOnly: true,
        });
        return context.redirect(`${env.CLIENT_URL}/auth/signup`);
      }

      const authRequest = auth.handleRequest(context);

      const session = await auth.createSession({
        userId: existingUser.userId,
        attributes: {},
      });

      authRequest.setSession(session);
      deleteCookie(context, OAUTH_STATE_COOKIE_NAME);

      return context.redirect(env.CLIENT_URL);
    } catch (e) {
      if (e instanceof OAuthRequestError) {
        throw new HTTPException(400, { message: "Bad request" });
      }
      throw new HTTPException(500, { message: "An unknown error occurred" });
    }
  },
);
