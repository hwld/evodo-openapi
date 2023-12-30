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
import { TaskDetailPage } from "./app/_main/tasks/$taskId/page";

const rootRoute = rootRouteWithContext()({
  component: RootLayout,
});

const indexRoute = new Route({
  path: "/",
  getParentRoute: () => rootRoute,
  beforeLoad: (): void => {
    throw redirect({
      to: "/tasks",
      search: defaultTaskSearchParams,
      replace: true,
    });
  },
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
  status_filter: schemas["status_filter_"]
    .transform((v) => {
      if (typeof v === "string") {
        return [v];
      }
      return v;
    })
    .default([])
    .catch([]),
  sort: schemas.TaskSort.catch("createdAt"),
  order: schemas.TaskSortOrder.catch("desc"),
  page: z.coerce.number().catch(1),
});
export type TaskSearchParams = z.infer<typeof taskSearchParamsSchema>;
export const defaultTaskSearchParams: TaskSearchParams = {
  status_filter: [],
  sort: "createdAt",
  order: "desc",
  page: 1,
};

const tasksRoute = new Route({
  getParentRoute: () => requireAuthRoute,
  path: "tasks",
  component: TasksPage,
  validateSearch: taskSearchParamsSchema,
});

const taskDetailRoute = new Route({
  getParentRoute: () => tasksRoute,
  path: "$taskId",
  component: TaskDetailPage,
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
  indexRoute,
  requireAuthRoute.addChildren([tasksRoute.addChildren([taskDetailRoute])]),
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
