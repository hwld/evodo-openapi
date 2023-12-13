import { cors } from "hono/cors";
import { swaggerUI } from "@hono/swagger-ui";
import { createApp } from "./app";
import { taskRoute } from "./features/task";
import { userRoute } from "./features/user";

const app = createApp();

app.use("*", (c, next) => {
  return cors({ origin: c.env.CLIENT_URL })(c, next);
});
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "evodo-openapi API",
  },
});
app.get("/ui", swaggerUI({ url: "/doc" }));

app.route("/", taskRoute).route("/", userRoute);

export default app;
