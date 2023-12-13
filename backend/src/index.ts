import { cors } from "hono/cors";
import { drizzle } from "drizzle-orm/d1";
import { users } from "./db/schema";
import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";

type Bindings = {
  CLIENT_URL: string;
  DB: D1Database;
};

const UserSchema = z
  .object({
    id: z.string().openapi({ example: "123" }),
    name: z.string().openapi({ example: "John Doe" }),
    createdAt: z.string().openapi({}),
    updatedAt: z.string().openapi({}),
  })
  .openapi("User");

const getUsersRoute = createRoute({
  method: "get",
  path: "/users",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(UserSchema),
        },
      },
      description: "Retrieve the user",
    },
  },
});

const createUserRoute = createRoute({
  method: "post",
  path: "/users",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({ name: z.string().min(1).max(200).openapi({}) }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: UserSchema,
        },
      },
      description: "Create a user",
    },
  },
});

const app = new OpenAPIHono<{ Bindings: Bindings }>();
app.use("*", (c, next) => {
  return cors({ origin: c.env.CLIENT_URL })(c, next);
});

app.openapi(getUsersRoute, async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(users).all();
  return c.json(result);
});

app.openapi(createUserRoute, async (c) => {
  const db = drizzle(c.env.DB);
  const { name } = c.req.valid("json");
  const createdUser = (await db.insert(users).values({ name }).returning())[0];

  return c.json(createdUser);
});

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "My API",
  },
});
app.get("/ui", swaggerUI({ url: "/doc" }));

export default app;
