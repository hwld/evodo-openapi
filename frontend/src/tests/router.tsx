import {
  Outlet,
  RootRoute,
  Route,
  RouteComponent,
  Router,
  RouterHistory,
  createHashHistory,
} from "@tanstack/react-router";

export const createTestRouter = (
  component: RouteComponent,
  history: RouterHistory = createHashHistory(),
) => {
  const rootRoute = new RootRoute({ component: Outlet });

  const componentRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "/",
    component,
  });

  const router = new Router({
    routeTree: rootRoute.addChildren([componentRoute]),
    history,
  });

  return router;
};
