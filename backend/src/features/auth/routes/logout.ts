import { createRoute, z } from "@hono/zod-openapi";
import { Features } from "../../features";
import { logoutPath } from "../path";
import { route } from "../../../app";
import { errorResponse } from "../../../lib/openapi";
import { LOGIN_SESSION_COOKIE } from "../consts";

const logoutRoute = createRoute({
  tags: [Features.auth],
  method: "post",
  path: logoutPath,
  summary: "ログアウトする",
  request: {
    cookies: z.object({ [LOGIN_SESSION_COOKIE]: z.string().optional() }),
  },
  responses: {
    ...errorResponse(500),
    200: {
      description: "ログアウト",
      content: { "application/json": { schema: z.object({}) } },
    },
  },
});
export const logout = route(logoutRoute.path).openapi(
  logoutRoute,
  async ({ json, var: { auth } }) => {
    await auth.loginSession.invalidate();
    return json({});
  },
);
