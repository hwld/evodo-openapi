import { createRoute, z } from "@hono/zod-openapi";
import { Features } from "../../features";
import { logoutPath } from "../path";
import { route } from "../../../app";
import { errorResponse } from "../../../lib/openapi";

const logoutRoute = createRoute({
  tags: [Features.auth],
  method: "post",
  path: logoutPath,
  summary: "ログアウトする",
  responses: {
    ...errorResponse(500),
    200: {
      description: "ログアウト",
      content: { "application/json": { schema: z.object({}) } },
    },
  },
});

export const logout = route().openapi(
  logoutRoute,
  async ({ json, var: { auth } }) => {
    await auth.loginSession.invalidate();
    return json({});
  },
);
