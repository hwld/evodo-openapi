import { createApp } from "./app";
import { taskRoute } from "./features/task";
import { userRoute } from "./features/user";
import { authRoute } from "./features/auth";

const app = createApp();
app.route("/", authRoute).route("/", taskRoute).route("/", userRoute);

export default app;
