import { OpenAPIHono } from "@hono/zod-openapi";
import { DrizzleD1Database, drizzle } from "drizzle-orm/d1";

type Bindings = {
  CLIENT_URL: string;
  DB: D1Database;
};

type Env = {
  Bindings: Bindings;
};
type RouteEnv = Env & { Variables: { db: DrizzleD1Database } };

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
 *  .route("api1", route1)
 *  .route("api2", route2);
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
    c.set("db", drizzle(c.env.DB));
    await next();
  });

  return app;
};
