import { createRoute, z } from "@hono/zod-openapi";
import { createHono } from "../../app";
import { TaskSchema } from "./schema";
import { drizzle } from "drizzle-orm/d1";
import { tasks } from "../../db/schema";

const getUsersRoute = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(TaskSchema),
        },
      },
      description: "取得成功",
    },
  },
});

export const findTasks = createHono().openapi(getUsersRoute, async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(tasks).all();
  return c.json(result);
});
