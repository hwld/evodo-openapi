import {
  NotFoundRoute,
  Route,
  Router,
  redirect,
  rootRouteWithContext,
} from "@tanstack/react-router";
import { api } from "./api";
import { LoginPage } from "./app/_auth/login/page";
import { SignupPage } from "./app/_auth/signup/page";
import { RootLayout } from "./app/layout";
import TasksPage from "./app/_main/tasks/page";
import { NotFoundPage } from "./app/404";
import { AuthErrorPage } from "./app/_auth/error";
import { z } from "zod";
import { schemas } from "./api/schema";

const rootRoute = rootRouteWithContext()({
  component: RootLayout,
});

const notFoundRoute = new NotFoundRoute({
  getParentRoute: () => rootRoute,
  component: NotFoundPage,
});

export const requireAuthRoute = new Route({
  id: "requireAuth",
  getParentRoute: () => rootRoute,
  beforeLoad: async () => {
    const { session } = await api.get("/session");
    if (!session) {
      throw redirect({ to: "/auth/login", replace: true });
    }
    return { session };
  },
});

const taskSearchParamsSchema = z.object({
  status_filter: schemas.status_filter.default([]).catch([]),
});
export type TaskSearchParams = z.infer<typeof taskSearchParamsSchema>;

const indexRoute = new Route({
  getParentRoute: () => requireAuthRoute,
  path: "/",
  component: TasksPage,
  validateSearch: taskSearchParamsSchema,
});

const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/auth/login",
  component: LoginPage,
});

const signupRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/auth/signup",
  beforeLoad: async () => {
    const { exists } = await api.get("/signup-session");
    if (!exists) {
      throw redirect({ to: "/", replace: true });
    }
  },
  component: SignupPage,
});

const authErrorRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/auth/error",
  component: AuthErrorPage,
});

const routeTree = rootRoute.addChildren([
  requireAuthRoute.addChildren([indexRoute]),
  loginRoute,
  signupRoute,
  authErrorRoute,
]);

export const router = new Router({
  routeTree,
  notFoundRoute,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
