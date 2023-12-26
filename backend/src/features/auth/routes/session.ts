import { createRoute, z } from "@hono/zod-openapi";
import { Features } from "../../features";
import { route } from "../../../app";
import { sessionPath } from "../path";
import { errorResponse } from "../../../lib/openapi";
import { LOGIN_SESSION_COOKIE } from "../consts";
import { SessionSchema } from "../schema";

const sessionRoute = createRoute({
  tags: [Features.auth],
  method: "get",
  path: sessionPath,
  summary: "ログインしているユーザーを取得する",
  request: {
    cookies: z.object({ [LOGIN_SESSION_COOKIE]: z.string().optional() }),
  },
  responses: {
    ...errorResponse(500),
    200: {
      content: {
        "application/json": {
          schema: z.object({
            session: SessionSchema.nullable(),
          }),
        },
      },
      description: "取得成功",
    },
  },
});

export const session = route(sessionRoute.path).openapi(
  sessionRoute,
  async ({ json, var: { auth } }) => {
    const { session, user } = await auth.loginSession.validate();
    if (!session) {
      return json({ session: null });
    }

    return json({ session: { user: { id: user.id, name: user.name } } });
  },
);
