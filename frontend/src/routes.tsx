import { Router } from "@tanstack/react-router";
import { loginRoute } from "./app/auth/login/page";
import { signupRoute } from "./app/auth/signup/page";
import { rootRoute } from "./app/layout";
import { notFoundRoute } from "./app/404";
import { indexRoute } from "./app/page";
import { requireAuthRoute } from "./app/_require-auth/layout";
import { authErrorRoute } from "./app/auth/error";
import { tasksRoute } from "./app/_require-auth/tasks/page";
import { taskDetailRoute } from "./app/_require-auth/tasks/$taskId/page";
import { LoadingPage } from "./app/loading";
import { ErrorPage } from "./app/error";

const routeTree = rootRoute.addChildren([
  indexRoute,
  requireAuthRoute.addChildren([tasksRoute.addChildren([taskDetailRoute])]),
  loginRoute,
  signupRoute,
  authErrorRoute,
]);

export const router = new Router({
  routeTree,
  notFoundRoute,
  defaultPendingComponent: LoadingPage,
  defaultErrorComponent: ErrorPage,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
