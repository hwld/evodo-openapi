import { OpenAPIHono } from "@hono/zod-openapi";

type Bindings = {
  CLIENT_URL: string;
  DB: D1Database;
};

export const createHono = () => new OpenAPIHono<{ Bindings: Bindings }>();
