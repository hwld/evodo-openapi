import { createRoute, z } from "@hono/zod-openapi";
import { Features } from "../../features";
import { UserSchema } from "../../user/schema";
import { route } from "../../../app";
import { sessionPath } from "../path";
import { errorResponse } from "../../../lib/openapi";

const sessionRoute = createRoute({
  tags: [Features.auth],
  method: "get",
  path: sessionPath,
  summary: "ログインしているユーザーを取得する",
  responses: {
    ...errorResponse(500),
    200: {
      content: {
        "application/json": {
          schema: z.object({ user: UserSchema }).nullable(),
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
      return json(null);
    }

    return json({ user: { id: user.id, name: user.name } });
  },
);
