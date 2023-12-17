import { Outlet, RootRoute, Route, Router } from "@tanstack/react-router";
import App from "./App";
import { SignupPage } from "./signup";

const rootRoute = new RootRoute({
  component: () => {
    return (
      <div className="h-[100dvh] bg-gray-200 text-gray-700 p-5">
        <Outlet />
      </div>
    );
  },
});

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: App,
});

const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/auth/login",
  component: () => {
    return <div>ログイン</div>;
  },
});

const signupRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/auth/signup",
  component: SignupPage,
});

const routeTree = rootRoute.addChildren([indexRoute, loginRoute, signupRoute]);

export const router = new Router({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
