import { OpenAPIHono } from "@hono/zod-openapi";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./services/db/schema";
import { DB } from "./services/db";
import { Auth } from "./services/auth/auth";
import { cors } from "hono/cors";
import { swaggerUI } from "@hono/swagger-ui";
import { HTTPException } from "hono/http-exception";
import { log, loggingContext } from "./services/logger";
import { csrf } from "hono/csrf";

type Env<B, V> = {
  Bindings: B;
  Variables: V;
};

export type AppBindings = {
  CLIENT_URL: string;
  ENVIRONMENT: "dev" | "prod";
  BASE_URL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  DB: D1Database;
  KV: KVNamespace;
};

export type AppEnv = Env<AppBindings, {}>;
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
    return csrf({ origin: c.env.CLIENT_URL })(c as any, next);
  });

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

  app.use("/open-api/*", async (c, next) => {
    if (c.env.ENVIRONMENT === "prod") {
      throw new HTTPException(404, { message: "404 Not Found" });
    }
    await next();
  });
  app.doc("/open-api/doc", {
    openapi: "3.0.0",
    info: { version: "1.0.0", title: "evodo-openapi API" },
  });
  app.get("/open-api/ui", async (c, next) => {
    if (c.env.ENVIRONMENT === "prod") {
      await next();
    }
    return swaggerUI<AppEnv>({ url: "/open-api/doc" })(c, next);
  });

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

type RouteEnv = AppEnv & Env<{}, { auth: Auth; db: DB }>;
export const route = <Env extends RouteEnv = RouteEnv>(path: string) => {
  const route = new OpenAPIHono<Env>({
    defaultHook: (result) => {
      if (!result.success) {
        log.error(`zod検証エラー: ${result.error.message}`);
        throw new HTTPException(400);
      }
    },
  });

  route.use(path, async (c, next) => {
    const db = drizzle(c.env.DB, { schema });
    const auth = new Auth(c, c.env, db);

    c.set("db", db);
    c.set("auth", auth);
    await next();
  });

  return route;
};

type RequireAuthRoute = RouteEnv & Env<{}, { loggedInUserId: string }>;
export const requireAuthRoute = (path: string) => {
  const requireAuthRoute = route<RequireAuthRoute>(path);

  requireAuthRoute.use(path, async (c, next) => {
    const { session } = await c.var.auth.loginSession.validate();
    if (!session) {
      log.error("セッションが存在しません");
      throw new HTTPException(401);
    }

    c.set("loggedInUserId", session.userId);
    await next();
  });

  return requireAuthRoute;
};
