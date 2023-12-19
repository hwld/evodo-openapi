import { createRoute, z } from "@hono/zod-openapi";
import { Features } from "../../features";
import { logoutPath } from "../path";
import { route } from "../../../app";
import {
  invalidateLoginSession,
  validateLoginSession,
} from "../../../auth/loginSession";
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

export const logout = route().openapi(logoutRoute, async (context) => {
  const {
    json,
    var: { auth },
  } = context;

  const { session } = await validateLoginSession(context, auth);
  if (session) {
    await invalidateLoginSession(context, auth, session.id);
  }

  return json({});
});
