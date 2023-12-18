import { createRoute, z } from "@hono/zod-openapi";
import { TaskSchema } from "../schema";
import { tasks } from "../../../db/schema";
import { route } from "../../../app";
import { tasksPath } from "../path";
import { Features } from "../../features";

const getTasksRoute = createRoute({
  tags: [Features.task],
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
    const result = await db.select().from(tasks).all();
    return json(result);
  },
);
