import { createRoute, z } from "@hono/zod-openapi";
import { taskPath } from "../path";
import { TaskSchema } from "../schema";
import { requireAuthRoute, route } from "../../../app";
import { tasks } from "../../../services/db/schema";
import { and, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { Features } from "../../features";
import { errorResponse } from "../../../lib/openapi";
import { LOGIN_SESSION_COOKIE } from "../../auth/consts";

const deleteTaskRoute = createRoute({
  tags: [Features.task],
  method: "delete",
  path: taskPath,
  summary: "タスクを削除する",
  request: {
    cookies: z.object({
      [LOGIN_SESSION_COOKIE]: z.string(),
    }),
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

export const deleteTask = requireAuthRoute(deleteTaskRoute.path).openapi(
  deleteTaskRoute,
  async ({ req, json, var: { db, loggedInUserId } }) => {
    const taskId = req.valid("param").id;

    const [deleted] = await db
      .delete(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.authorId, loggedInUserId)))
      .returning();
    if (!deleted) {
      throw new HTTPException(404, { message: "not found" });
    }

    return json(deleted);
  },
);
