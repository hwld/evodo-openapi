import { createRoute, z } from "@hono/zod-openapi";
import { Features } from "../../features";
import { logoutPath } from "../path";
import { route } from "../../../app";
import { HTTPException } from "hono/http-exception";

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
    var: { auth },
  } = context;

  const authRequest = auth.handleRequest(context);
  const session = await authRequest.validate();
  if (!session) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  await auth.invalidateSession(session.sessionId);
  authRequest.setSession(null);

  return json({});
});
