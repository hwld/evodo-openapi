import { Hono } from "hono";
import { cors } from "hono/cors";

type Bindings = {
  CLIENT_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("/", (c, next) => {
  return cors({ origin: c.env.CLIENT_URL })(c, next);
});
app.get("/", (c) => c.text("Hello Hono!"));

export default app;
