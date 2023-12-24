import { RootRoute, Route, Router, redirect } from "@tanstack/react-router";
import { api } from "./api";
import { LoginPage } from "./app/_auth/login/page";
import { SignupPage } from "./app/_auth/signup/page";
import { RequireAuthLayout } from "./app/_main/layout";
import { RootLayout } from "./app/layout";
import TasksPage from "./app/_main/tasks/page";

const rootRoute = new RootRoute({
  component: RootLayout,
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
