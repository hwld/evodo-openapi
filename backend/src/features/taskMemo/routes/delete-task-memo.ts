import { createRoute, z } from "@hono/zod-openapi";
import { Features } from "../../features";
import { taskMemoPath } from "../path";
import { LOGIN_SESSION_COOKIE } from "../../auth/consts";
import { errorResponse } from "../../../lib/openapi";
import { TaskMemoSchema } from "../schema";
import { requireAuthRoute } from "../../../app";
import { taskMemos } from "../../../services/db/schema";
import { and, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

const deleteTaskMemoRoute = createRoute({
  tags: [Features.taskMemo],
  path: taskMemoPath,
  method: "delete",
  request: {
    cookies: z.object({ [LOGIN_SESSION_COOKIE]: z.string().optional() }),
    params: z.object({
      taskId: z.string(),
      taskMemoId: z.string(),
    }),
  },
  responses: {
    ...errorResponse(400),
    ...errorResponse(500),
    200: {
      description: "削除したタスクメモ",
      content: {
        "application/json": {
          schema: z.object({ deletedTaskMemo: TaskMemoSchema }),
        },
      },
    },
  },
});

export const deleteTaskMemo = requireAuthRoute(
  deleteTaskMemoRoute.path,
).openapi(
  deleteTaskMemoRoute,
  async ({ json, req, var: { loggedInUserId, db } }) => {
    const { taskId, taskMemoId } = req.valid("param");

    const [deleted] = await db
      .delete(taskMemos)
      .where(
        and(
          eq(taskMemos.id, taskMemoId),
          eq(taskMemos.taskId, taskId),
          eq(taskMemos.authorId, loggedInUserId),
        ),
      )
      .returning();
    if (!deleted) {
      throw new HTTPException(404, { message: "not found" });
    }

    return json({ deletedTaskMemo: deleted });
  },
);
