import { loginRoute } from "./app/auth/login/page";
import { signupRoute } from "./app/auth/signup/page";
import { rootRoute } from "./app/layout";
import { indexRoute } from "./app/page";
import { requireAuthRoute } from "./app/_require-auth/layout";
import { authErrorRoute } from "./app/auth/error";
import { tasksRoute } from "./app/_require-auth/tasks/page";
import { taskDetailRoute } from "./app/_require-auth/tasks/$taskId/page";

export const routeTree = rootRoute.addChildren([
  indexRoute,
  requireAuthRoute.addChildren([tasksRoute.addChildren([taskDetailRoute])]),
  loginRoute,
  signupRoute,
  authErrorRoute,
]);
