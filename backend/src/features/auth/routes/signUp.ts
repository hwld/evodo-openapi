import { createRoute, z } from "@hono/zod-openapi";
import { Features } from "../../features";
import { signupPath } from "../path";
import { route } from "../../../app";
import { deleteCookie, getCookie } from "hono/cookie";
import { SIGNUP_SESSION_COOKIE_NAME } from "../consts";
import { HTTPException } from "hono/http-exception";
import { signupSessionsTable } from "../../../db/schema";
import { eq } from "drizzle-orm";

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
    cookies: z.object({ [SIGNUP_SESSION_COOKIE_NAME]: z.string() }),
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
    var: { auth, db },
  } = context;

  // 新規登録セッションが存在するかを確認する
  const signupSessionId = getCookie(context, SIGNUP_SESSION_COOKIE_NAME);
  if (!signupSessionId) {
    deleteCookie(context, SIGNUP_SESSION_COOKIE_NAME);
    throw new HTTPException(401);
  }

  const signupSession = await db.query.signupSessionsTable.findFirst({
    where: eq(signupSessionsTable.id, signupSessionId),
  });
  if (!signupSession) {
    deleteCookie(context, SIGNUP_SESSION_COOKIE_NAME);
    throw new HTTPException(401);
  }
  if (Date.now() > signupSession.expires) {
    await db
      .delete(signupSessionsTable)
      .where(eq(signupSessionsTable.id, signupSession.id));
    deleteCookie(context, SIGNUP_SESSION_COOKIE_NAME);
    throw new HTTPException(401);
  }

  const { username, profile } = req.valid("json");
  const newUser = await auth.createUser({
    key: {
      // https://github.com/lucia-auth/lucia/blob/625350e1dba70c68a7eb47ec792b768bb7353741/packages/oauth/src/providers/google.ts#L19
      // と合わせる必要がある。
      // GoogleUserAuthのcreateUserを使用したかったのだが、このエンドポイントでは認可コードの検証が失敗するため、
      // validateCallbackの返り値のGoogleUserAuthが使えない。そのため、AuthのcreateUserを使う。
      // 合わせる必要があるのは、GoogleUserAuthでexistingUserを使用する場合に間接的にproviderIdを比較するため。
      providerId: "google",
      providerUserId: signupSession.googleUserId,
      password: null,
    },
    attributes: { name: username, profile: profile },
  });

  const session = await auth.createSession({
    userId: newUser.userId,
    attributes: {},
  });

  const authRequest = auth.handleRequest(context);
  authRequest.setSession(session);

  await db
    .delete(signupSessionsTable)
    .where(eq(signupSessionsTable.id, signupSession.id));
  deleteCookie(context, SIGNUP_SESSION_COOKIE_NAME);
  return json({ userId: newUser.userId });
});
