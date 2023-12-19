import { createRoute, z } from "@hono/zod-openapi";
import { Features } from "../../features";
import { UserSchema } from "../../user/schema";
import { route } from "../../../app";
import { sessionPath } from "../path";
import { validateLoginSession } from "../../../auth/loginSession";

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

  const { session, user } = await validateLoginSession(context, auth);
  if (!session) {
    return json(null);
  }

  return json({ user: { id: user.id, name: user.name } });
});
