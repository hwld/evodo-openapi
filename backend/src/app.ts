import { OpenAPIHono } from "@hono/zod-openapi";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./services/db/schema";
import { DB } from "./services/db";
import { Auth } from "./services/auth/auth";
import { cors } from "hono/cors";
import { swaggerUI } from "@hono/swagger-ui";
import { HTTPException } from "hono/http-exception";
import { loggingContext } from "./services/logger";

export type AppBindings = {
  CLIENT_URL: string;
  ENVIRONMENT: "dev" | "prod";
  BASE_URL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  DB: D1Database;
  KV: KVNamespace;
};

export type AppEnv = {
  Bindings: AppBindings;
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
export const createApp = () => {
  const app = new OpenAPIHono<AppEnv>();

  app.use("*", (c, next) => {
    return cors({ origin: c.env.CLIENT_URL, credentials: true })(c, next);
  });

  app.use("*", async (c, next) => {
    return loggingContext.run(
      { isProduction: c.env.ENVIRONMENT === "prod" },
      next,
    );
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

type RouteVariables = {
  auth: Auth;
  db: DB;
};
export const route = <Variables extends RouteVariables = RouteVariables>(
  path: string,
) => {
  const route = new OpenAPIHono<{
    Bindings: AppBindings;
    Variables: RouteVariables & Variables;
  }>();
  route.use(path, async (c, next) => {
    const db = drizzle(c.env.DB, { schema });
    const auth = new Auth(c, c.env, db);

    c.set("db", db);
    c.set("auth", auth);
    await next();
  });

  return route;
};

type RequireAuthVariables = RouteVariables & { loggedInUserId: string };
export const requireAuthRoute = (path: string) => {
  const requireAuthRoute = route<RequireAuthVariables>(path);
  requireAuthRoute.use(path, async (c, next) => {
    const { session } = await c.var.auth.loginSession.validate();
    if (!session) {
      throw new HTTPException(401);
    }

    c.set("loggedInUserId", session.userId);
    await next();
  });

  return requireAuthRoute;
};
