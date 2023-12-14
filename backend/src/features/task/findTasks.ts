import { createRoute, z } from "@hono/zod-openapi";
import { TaskSchema } from "./schema";
import { tasksTable } from "../../db/schema";
import { route } from "../../app";
import { tasksPath } from "./path";

const getTasksRoute = createRoute({
  method: "get",
  path: tasksPath,
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

export const findTasks = route().openapi(
  getTasksRoute,
  async ({ json, var: { db } }) => {
    const result = await db.select().from(tasksTable).all();
    return json(result);
  },
);
