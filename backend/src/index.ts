import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { swaggerUI } from "@hono/swagger-ui";
import { createApp } from "./app";
import { taskRoute } from "./features/task";
import { userRoute } from "./features/user";
import { authRoute } from "./features/auth";
import { Auth } from "./auth/lucia";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./db/schema";

const app = createApp();

app.use("*", (c, next) => {
  return cors({ origin: c.env.CLIENT_URL, credentials: true })(c, next);
});
app.use("*", logger());
app.use("*", async (c, next) => {
  const db = drizzle(c.env.DB, { schema });
  const auth = new Auth(c, c.env, db);

  c.set("db", db);
  c.set("auth", auth);
  await next();
});

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "evodo-openapi API",
  },
});
app.get("/ui", swaggerUI({ url: "/doc" }));

app.route("/", authRoute).route("/", taskRoute).route("/", userRoute);

export default app;
