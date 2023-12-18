import { createRoute, z } from "@hono/zod-openapi";
import { Features } from "../../features";
import { logoutPath } from "../path";
import { route } from "../../../app";
import { HTTPException } from "hono/http-exception";
import { validateLoginSession } from "../../../auth/session";
import { deleteCookie, setCookie } from "hono/cookie";
import { LOGIN_SESSION_COOKIE } from "../consts";

const logoutRoute = createRoute({
  tags: [Features.auth],
  method: "post",
  path: logoutPath,
  responses: {
    200: {
      description: "ログアウト",
      content: {
        "application/json": {
          schema: z.object({}),
        },
      },
    },
  },
});

export const logout = route().openapi(logoutRoute, async (context) => {
  const {
    json,
    var: { auth, db },
  } = context;

  const { session } = await validateLoginSession(context, auth, db);
  if (!session) {
    throw new HTTPException(401);
  }

  await auth.invalidateSession(session.id);
  deleteCookie(context, LOGIN_SESSION_COOKIE);

  return json({});
});
