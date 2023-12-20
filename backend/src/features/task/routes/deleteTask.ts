import { createRoute, z } from "@hono/zod-openapi";
import { taskPath } from "../path";
import { TaskSchema } from "../schema";
import { route } from "../../../app";
import { tasks } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { Features } from "../../features";
import { errorResponse } from "../../../lib/openapi";

const DeleteTaskRoute = createRoute({
  tags: [Features.task],
  method: "delete",
  path: taskPath,
  summary: "タスクを削除する",
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
      description: "削除したタスクを返す",
      content: {
        "application/json": {
          schema: TaskSchema,
        },
      },
    },
  },
});

export const deleteTask = route().openapi(
  DeleteTaskRoute,
  async ({ req, json, var: { db } }) => {
    const taskId = req.valid("param").id;

    const [deleted] = await db
      .delete(tasks)
      .where(eq(tasks.id, taskId))
      .returning();
    if (!deleted) {
      throw new HTTPException(404, { message: "not found" });
    }

    return json(deleted);
  },
);
