import { createRoute, z } from "@hono/zod-openapi";
import { taskPath } from "../path";
import { TaskSchema } from "../schema";
import { route } from "../../../app";
import { eq } from "drizzle-orm";
import { tasks } from "../../../services/db/schema";
import { HTTPException } from "hono/http-exception";
import { Features } from "../../features";
import { errorResponse } from "../../../lib/openapi";

const getTaskRoute = createRoute({
  tags: [Features.task],
  method: "get",
  path: taskPath,
  summary: "タスクを取得する",
  request: {
    params: z.object({
      id: z.string().openapi({ param: { name: "id", in: "path" } }),
    }),
  },
  responses: {
    ...errorResponse(400),
    ...errorResponse(404, "タスクが存在しない"),
    ...errorResponse(500),
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
    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
    });

    if (!task) {
      throw new HTTPException(404, { message: "not found" });
    }

    return json(task);
  },
);