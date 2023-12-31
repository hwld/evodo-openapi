import { createApp } from "./app";
import { taskRoute } from "./features/task";
import { userRoute } from "./features/user";
import { authRoute } from "./features/auth";
import { taskMemoRoute } from "./features/taskMemo";

const app = createApp();
app
  .route("/", authRoute)
  .route("/", taskRoute)
  .route("/", taskMemoRoute)
  .route("/", userRoute);

export default app;
