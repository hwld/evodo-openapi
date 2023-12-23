import { RootRoute, Route, Router } from "@tanstack/react-router";
import { SignupPage } from "./signup";
import { RootPage } from "./root";
import TasksPage from "./tasks";
import { LoginPage } from "./login";
import { RequireAuthPage } from "./require-auth-page";

const rootRoute = new RootRoute({
  component: RootPage,
});

const requireAuthRoute = new Route({
  id: "requireAuthRoute",
  getParentRoute: () => rootRoute,
  component: RequireAuthPage,
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
  component: SignupPage,
});

const routeTree = rootRoute.addChildren([
  requireAuthRoute.addChildren([indexRoute]),
  loginRoute,
  signupRoute,
]);

export const router = new Router({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
