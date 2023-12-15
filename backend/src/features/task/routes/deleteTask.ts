import { createRoute, z } from "@hono/zod-openapi";
import { taskPath } from "../path";
import { TaskSchema } from "../schema";
import { route } from "../../../app";
import { tasksTable } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

const DeleteTaskRoute = createRoute({
  method: "delete",
  path: taskPath,
  request: {
    params: z.object({
      id: z.string().openapi({ param: { name: "id", in: "path" } }),
    }),
  },
  responses: {
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

    const result = await db
      .delete(tasksTable)
      .where(eq(tasksTable.id, taskId))
      .returning();

    const deleted = result[0];
    if (!deleted) {
      throw new HTTPException(404, { message: "not found" });
    }

    return json(deleted);
  },
);
