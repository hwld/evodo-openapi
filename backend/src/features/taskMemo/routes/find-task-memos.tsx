import { createRoute, z } from "@hono/zod-openapi";
import { Features } from "../../features";
import { taskMemosPath } from "../path";
import { errorResponse } from "../../../lib/openapi";
import { TaskMemoSchema } from "../schema";
import { LOGIN_SESSION_COOKIE } from "../../auth/consts";
import { requireAuthRoute } from "../../../app";
import { and, eq } from "drizzle-orm";
import { taskMemos } from "../../../services/db/schema";

const findTaskMemosRoute = createRoute({
  tags: [Features.taskMemo],
  method: "get",
  path: taskMemosPath,
  summary: "全てのタスクのメモを取得する",
  request: {
    cookies: z.object({ [LOGIN_SESSION_COOKIE]: z.string().optional() }),
    params: z.object({ taskId: z.string() }),
  },
  responses: {
    ...errorResponse(400),
    ...errorResponse(500),
    200: {
      content: {
        "application/json": {
          schema: z.object({ taskMemos: z.array(TaskMemoSchema) }),
        },
      },
      description: "取得成功",
    },
  },
});

export const findTaskMemos = requireAuthRoute(findTaskMemosRoute.path).openapi(
  findTaskMemosRoute,
  async ({ req, json, var: { loggedInUserId, db } }) => {
    const { taskId } = req.valid("param");

    const findedMemos = await db.query.taskMemos.findMany({
      where: and(
        eq(taskMemos.taskId, taskId),
        eq(taskMemos.authorId, loggedInUserId),
      ),
    });

    return json({ taskMemos: findedMemos });
  },
);
