import { Hono } from "hono";
import { cors } from "hono/cors";
import { drizzle } from "drizzle-orm/d1";
import { users } from "./db/schema";

type Bindings = {
  CLIENT_URL: string;
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("/", (c, next) => {
  return cors({ origin: c.env.CLIENT_URL })(c, next);
});
app.get("/", async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(users).all();
  return c.json(result);
});

export default app;
