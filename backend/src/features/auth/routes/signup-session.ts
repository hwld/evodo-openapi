import { createRoute, z } from "@hono/zod-openapi";
import { Features } from "../../features";
import { signupSessionPath } from "../path";
import { errorResponse } from "../../../lib/openapi";
import { route } from "../../../app";

const signupSessionRoute = createRoute({
  tags: [Features.auth],
  method: "get",
  path: signupSessionPath,
  summary: "新規登録セッションの有無を確認する",
  responses: {
    ...errorResponse(500),
    200: {
      content: {
        "application/json": {
          schema: z.boolean(),
        },
      },
      description: "取得成功",
    },
  },
});

export const signupSession = route(signupSessionRoute.path).openapi(
  signupSessionRoute,
  async ({ json, var: { auth } }) => {
    const session = await auth.signupSession.validate();
    if (!session) {
      return json(false);
    }

    return json(true);
  },
);
