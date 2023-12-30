import { Route, redirect } from "@tanstack/react-router";
import { rootRoute } from "./layout";
import { defaultTaskSearchParams } from "./_require-auth/tasks/page";

export const indexRoute = new Route({
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
