import { createRoute } from "@hono/zod-openapi";
import { route } from "../../../app";
import { loginCallbackPath } from "../path";
import { Features } from "../../features";
import { getCookie } from "hono/cookie";
import { OAUTH_STATE_COOKIE_NAME } from "../consts";
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
      const { getExistingUser, createUser, googleUser } =
        await googleAuth.validateCallback(code);

      const getUser = async () => {
        const existingUser = await getExistingUser();
        if (existingUser) {
          return existingUser;
        }

        const user = await createUser({
          attributes: { name: googleUser.name },
        });
        return user;
      };

      const user = await getUser();
      const session = await auth.createSession({
        userId: user.userId,
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
