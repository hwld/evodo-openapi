import { createRoute, z } from "@hono/zod-openapi";
import { TaskSchema } from "./schema";
import { createHono } from "../../app";
import { drizzle } from "drizzle-orm/d1";
import { tasks } from "../../db/schema";

const CreateTaskInput = z
  .object({
    title: z.string().min(1).max(200),
  })
  .openapi("CreateTaskInput");

const createTaskRoute = createRoute({
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateTaskInput,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: TaskSchema,
        },
      },
      description: "作成成功",
    },
  },
});

export const createTask = createHono().openapi(createTaskRoute, async (c) => {
  const db = drizzle(c.env.DB);
  const { title } = c.req.valid("json");
  const created = (
    await db.insert(tasks).values({ title, description: "" }).returning()
  )[0];

  return c.json(created);
});
