import { OpenAPIHono } from "@hono/zod-openapi";
import { DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import * as schema from "./db/schema";
import { Auth, GoogleAuth } from "./auth/lucia";
import { DB } from "./db";

export type Bindings = {
  CLIENT_URL: string;
  ENVIRONMENT: "dev" | "prod";
  BASE_URL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  DB: D1Database;
};
type Variables = { auth: Auth; googleAuth: GoogleAuth };

type Env = {
  Bindings: Bindings;
  Variables: Variables;
};

type RouteEnv = Env & {
  Variables: Variables & {
    db: DB;
  };
};

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
export const createApp = () => new OpenAPIHono<Env>();

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
  const app = new OpenAPIHono<RouteEnv>();
  app.use("*", async (c, next) => {
    c.set("db", drizzle(c.env.DB, { schema }));
    await next();
  });

  return app;
};
