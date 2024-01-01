import { createRoute, z } from "@hono/zod-openapi";
import { Features } from "../../features";
import { taskMemosPath } from "../path";
import { errorResponse } from "../../../lib/openapi";
import { CreateTaskMemoInputSchema, TaskMemoSchema } from "../schema";
import { LOGIN_SESSION_COOKIE } from "../../auth/consts";
import { requireAuthRoute } from "../../../app";
import { taskMemos, tasks } from "../../../services/db/schema";
import { and, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

const createTaskMemoRoute = createRoute({
  tags: [Features.taskMemo],
  method: "post",
  path: taskMemosPath,
  summary: "タスクメモを作成する",
  request: {
    cookies: z.object({
      [LOGIN_SESSION_COOKIE]: z.string().optional(),
    }),
    params: z.object({
      taskId: z.string().openapi({ param: { name: "taskId", in: "path" } }),
    }),
    body: {
      content: {
        "application/json": {
          schema: CreateTaskMemoInputSchema,
        },
      },
    },
  },
  responses: {
    ...errorResponse(400),
    ...errorResponse(500),
    200: {
      content: {
        "application/json": {
          schema: z.object({ createdTaskMemo: TaskMemoSchema }),
        },
      },
      description: "作成成功",
    },
  },
});

export const createTaskMemo = requireAuthRoute(
  createTaskMemoRoute.path,
).openapi(
  createTaskMemoRoute,
  async ({ json, var: { loggedInUserId, db }, req }) => {
    const { taskId } = req.valid("param");
    const { content } = req.valid("json");

    const task = await db.query.tasks.findFirst({
      where: and(eq(tasks.id, taskId), eq(tasks.authorId, loggedInUserId)),
    });
    if (!task) {
      throw new HTTPException(404, { message: "not found" });
    }

    const [created] = await db
      .insert(taskMemos)
      .values({ content, taskId, authorId: loggedInUserId })
      .returning();

    return json({ createdTaskMemo: created });
  },
);
