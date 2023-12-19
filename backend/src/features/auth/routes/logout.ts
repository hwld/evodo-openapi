import { createRoute, z } from "@hono/zod-openapi";
import { Features } from "../../features";
import { logoutPath } from "../path";
import { route } from "../../../app";
import {
  setLoginSessionCookie,
  validateLoginSession,
} from "../../../auth/loginSession";

const logoutRoute = createRoute({
  tags: [Features.auth],
  method: "post",
  path: logoutPath,
  responses: {
    200: {
      description: "ログアウト",
      content: {
        "application/json": {
          schema: z.null(),
        },
      },
    },
  },
});

export const logout = route().openapi(logoutRoute, async (context) => {
  const {
    json,
    var: { auth },
  } = context;

  const { session } = await validateLoginSession(context, auth);
  if (!session) {
    return json(null);
  }

  await auth.invalidateSession(session.id);
  setLoginSessionCookie(context, auth.createBlankSessionCookie());

  return json(null);
});
