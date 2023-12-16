import { createRoute, z } from "@hono/zod-openapi";
import { Features } from "../../features";
import { UserSchema } from "../../user/schema";
import { route } from "../../../app";
import { sessionPath } from "../path";

const sessionRoute = createRoute({
  tags: [Features.auth],
  method: "get",
  path: sessionPath,
  responses: {
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

export const session = route().openapi(sessionRoute, async (context) => {
  const {
    json,
    var: { auth },
  } = context;

  const authRequest = auth.handleRequest(context);
  const session = await authRequest.validate();
  if (!session) {
    return json(null);
  }

  const user = session.user;
  return json({ user: { id: user.userId, name: user.name } });
});
