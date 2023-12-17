import { createRoute } from "@hono/zod-openapi";
import { route } from "../../../app";
import { loginCallbackPath } from "../path";
import { Features } from "../../features";
import { getCookie, setCookie } from "hono/cookie";
import { OAUTH_CODE_COOKIE_NAME, OAUTH_STATE_COOKIE_NAME } from "../consts";
import { OAuthRequestError } from "@lucia-auth/oauth";
import { HTTPException } from "hono/http-exception";

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
      var: { googleAuth, auth },
      env,
    } = context;

    const storedState = getCookie(context, OAUTH_STATE_COOKIE_NAME);
    const { code, state } = req.query();

    if (
      !storedState ||
      !state ||
      storedState !== state ||
      typeof code !== "string"
    ) {
      throw new HTTPException(400, { message: "Bad request" });
    }
    try {
      const { getExistingUser } = await googleAuth.validateCallback(code);

      const existingUser = await getExistingUser();

      // 新規登録のユーザーは認可コードをcookieに含めて新規登録ページに飛ばす
      if (!existingUser) {
        setCookie(context, OAUTH_CODE_COOKIE_NAME, code, { httpOnly: true });
        return context.redirect(`${env.CLIENT_URL}/signUp`);
      }

      const session = await auth.createSession({
        userId: existingUser.userId,
        attributes: {},
      });

      const authRequest = auth.handleRequest(context);
      authRequest.setSession(session);

      return context.redirect(env.CLIENT_URL);
    } catch (e) {
      if (e instanceof OAuthRequestError) {
        throw new HTTPException(400, { message: "Bad request" });
      }
      throw new HTTPException(500, { message: "An unknown error occurred" });
    }
  },
);
