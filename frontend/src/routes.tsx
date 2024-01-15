import { loginRoute } from "./app/auth/login";
import { signupRoute } from "./app/auth/signup";
import { rootRoute } from "./app/layout";
import { requireAuthRoute } from "./app/_require-auth/layout";
import { authErrorRoute } from "./app/auth/error";
import { tasksRoute } from "./app/_require-auth/tasks/page";
import { taskDetailRoute } from "./app/_require-auth/tasks/$taskId";
import { indexRoute } from "./app";

export const routeTree = rootRoute.addChildren([
  indexRoute,
  requireAuthRoute.addChildren([tasksRoute.addChildren([taskDetailRoute])]),
  loginRoute,
  signupRoute,
  authErrorRoute,
]);
