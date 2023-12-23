import { createRoute, z } from "@hono/zod-openapi";
import { TaskSchema } from "../schema";
import { tasks } from "../../../services/db/schema";
import { requireAuthRoute } from "../../../app";
import { tasksPath } from "../path";
import { Features } from "../../features";
import { errorResponse } from "../../../lib/openapi";
import { eq } from "drizzle-orm";
import { LOGIN_SESSION_COOKIE } from "../../auth/consts";

const getTasksRoute = createRoute({
  tags: [Features.task],
  method: "get",
  path: tasksPath,
  summary: "全てのタスクを取得する",
  request: {
    cookies: z.object({
      [LOGIN_SESSION_COOKIE]: z.string(),
    }),
  },
  responses: {
    ...errorResponse(500),
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

export const findTasks = requireAuthRoute(getTasksRoute.path).openapi(
  getTasksRoute,
  async ({ json, var: { db, loggedInUserId } }) => {
    const result = await db.query.tasks.findMany({
      where: eq(tasks.authorId, loggedInUserId),
    });
    return json(result);
  },
);
