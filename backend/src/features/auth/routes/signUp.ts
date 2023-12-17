import { createRoute, z } from "@hono/zod-openapi";
import { Features } from "../../features";
import { signupPath } from "../path";
import { route } from "../../../app";
import { deleteCookie, getCookie } from "hono/cookie";
import { OAUTH_CODE_COOKIE_NAME } from "../consts";
import { HTTPException } from "hono/http-exception";
import { OAuthRequestError } from "@lucia-auth/oauth";

const SignupInput = z
  .object({
    username: z.string().min(1).max(100),
    profile: z.string().max(1000),
  })
  .openapi("SignupInput");

const signupRoute = createRoute({
  tags: [Features.auth],
  method: "post",
  path: signupPath,
  request: {
    cookies: z.object({ [OAUTH_CODE_COOKIE_NAME]: z.string() }),
    body: {
      content: {
        "application/json": {
          schema: SignupInput,
        },
      },
    },
  },
  responses: {
    200: {
      description: "新規登録成功",
      content: {
        "application/json": {
          schema: z.object({ userId: z.string() }),
        },
      },
    },
    400: { description: "不正なリクエスト" },
    500: { description: "不明なエラー" },
  },
});

export const signup = route().openapi(signupRoute, async (context) => {
  const {
    json,
    req,
    var: { googleAuth, auth },
  } = context;

  const code = getCookie(context, OAUTH_CODE_COOKIE_NAME);
  if (typeof code !== "string") {
    throw new HTTPException(400, { message: "Bad request" });
  }

  try {
    const { createUser } = await googleAuth.validateCallback(code);
    const { username, profile } = req.valid("json");
    const newUser = await createUser({
      attributes: { name: username, profile },
    });

    const session = await auth.createSession({
      userId: newUser.userId,
      attributes: {},
    });

    const authRequest = auth.handleRequest(context);
    authRequest.setSession(session);

    deleteCookie(context, OAUTH_CODE_COOKIE_NAME);
    return json({ userId: newUser.userId });
  } catch (e) {
    if (e instanceof OAuthRequestError) {
      throw new HTTPException(400, { message: "Bad request" });
    }
    throw new HTTPException(500, { message: "An unknown error occurred" });
  }
});
