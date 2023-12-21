import { OpenAPIHono } from "@hono/zod-openapi";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./db/schema";
import { DB } from "./db";
import { Auth } from "./auth/auth";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { swaggerUI } from "@hono/swagger-ui";

export type Bindings = {
  CLIENT_URL: string;
  ENVIRONMENT: "dev" | "prod";
  BASE_URL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  DB: D1Database;
  KV: KVNamespace;
};
type RouteVariables = {
  auth: Auth;
  db: DB;
};

type AppEnv = {
  Bindings: Bindings;
};
export type RouteEnv = { Bindings: Bindings; Variables: RouteVariables };

/**
 * routerをつなげるトップレベルのHono
 * @example
 * const app = createApp();
 * //...
 * app
 *  .route("/", router1)
 *  .route("/", router2);
 * //...
 * export default app
 */
export const createApp = () => {
  const app = new OpenAPIHono<AppEnv>();

  app.use("", logger());
  app.use("*", (c, next) => {
    return cors({ origin: c.env.CLIENT_URL, credentials: true })(c, next);
  });

  // OpenAPI
  app.doc("/doc", {
    openapi: "3.0.0",
    info: { version: "1.0.0", title: "evodo-openapi API" },
  });
  app.get("/ui", swaggerUI({ url: "/doc" }));

  return app;
};

// Routeをつなげるために使用する
/**
 * Routeをつなげる
 * @example
 * appRouter()
 *  .route("/", route1)
 *  .route("/", route2);
 */
export const appRouter = () => new OpenAPIHono();

/**
 * routeを作成する
 * @example
 * export const route = route().openapi(...);
 */
export const route = () => {
  const route = new OpenAPIHono<RouteEnv>();
  route.use("*", async (c, next) => {
    const db = drizzle(c.env.DB, { schema });
    const auth = new Auth(c, db);

    c.set("db", db);
    c.set("auth", auth);
    await next();
  });

  return route;
};
