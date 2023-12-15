import { createRoute, z } from "@hono/zod-openapi";
import { taskPath } from "../path";
import { TaskSchema } from "../schema";
import { route } from "../../../app";
import { eq } from "drizzle-orm";
import { tasksTable } from "../../../db/schema";
import { HTTPException } from "hono/http-exception";

const getTaskRoute = createRoute({
  method: "get",
  path: taskPath,
  request: {
    params: z.object({
      id: z.string().openapi({ param: { name: "id", in: "path" } }),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: TaskSchema,
        },
      },
      description: "取得成功",
    },
  },
});

export const findTask = route().openapi(
  getTaskRoute,
  async ({ req, json, var: { db } }) => {
    const taskId = req.valid("param").id;
    const task = await db.query.tasksTable.findFirst({
      where: eq(tasksTable.id, taskId),
    });

    if (!task) {
      throw new HTTPException(404, { message: "not found" });
    }

    return json(task);
  },
);
