import { createRoute } from "@hono/zod-openapi";
import { route } from "../../../app";
import { loginPath } from "../path";
import { Features } from "../../features";
import { errorResponse } from "../../../lib/openapi";

const loginRoute = createRoute({
  tags: [Features.auth],
  method: "get",
  path: loginPath,
  summary: "GoogleのログインURLにリダイレクト",
  responses: {
    ...errorResponse(500),
    302: {
      description: "リダイレクト",
    },
  },
});

export const login = route(loginRoute.path).openapi(
  loginRoute,
  async ({ redirect, var: { auth } }) => {
    const url = await auth.createAuthUrl();
    return redirect(url.toString());
  },
);
