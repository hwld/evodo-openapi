import {
  NotFoundRoute,
  RootRoute,
  Route,
  Router,
  redirect,
} from "@tanstack/react-router";
import { api } from "./api";
import { LoginPage } from "./app/_auth/login/page";
import { SignupPage } from "./app/_auth/signup/page";
import { RequireAuthLayout } from "./app/_main/layout";
import { RootLayout } from "./app/layout";
import TasksPage from "./app/_main/tasks/page";
import { NotFoundPage } from "./app/404";
import { AuthErrorPage } from "./app/_auth/error";

const rootRoute = new RootRoute({
  component: RootLayout,
});

const notFoundRoute = new NotFoundRoute({
  getParentRoute: () => rootRoute,
  component: NotFoundPage,
});

const requireAuthRoute = new Route({
  id: "requireAuthRoute",
  getParentRoute: () => rootRoute,
  component: RequireAuthLayout,
});

const indexRoute = new Route({
  getParentRoute: () => requireAuthRoute,
  path: "/",
  component: TasksPage,
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

export const router = new Router({ routeTree, notFoundRoute });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
