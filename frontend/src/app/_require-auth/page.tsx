import { Route, redirect } from "@tanstack/react-router";
import { rootRoute } from "../layout";
import { api } from "@/api";

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
