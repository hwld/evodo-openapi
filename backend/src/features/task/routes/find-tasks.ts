import { createRoute, z } from "@hono/zod-openapi";
import { TaskSchema, TaskStatusSchema } from "../schema";
import { tasks } from "../../../services/db/schema";
import { requireAuthRoute } from "../../../app";
import { tasksPath } from "../path";
import { Features } from "../../features";
import { errorResponse } from "../../../lib/openapi";
import { and, eq, inArray } from "drizzle-orm";
import { LOGIN_SESSION_COOKIE } from "../../auth/consts";

const statusFilter = "status_filter";
const statusFilterSchema = z.array(TaskStatusSchema).optional().default([]);

const getTasksRoute = createRoute({
  tags: [Features.task],
  method: "get",
  path: tasksPath,
  summary: "全てのタスクを取得する",
  request: {
    cookies: z.object({
      [LOGIN_SESSION_COOKIE]: z.string().optional(),
    }),
    // 実際にバリデーションには使用しないが、スキーマに残すために書く
    query: z.object({
      [statusFilter]: statusFilterSchema,
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
  async ({ json, var: { db, loggedInUserId }, req }) => {
    // TODO:
    // zodiosではqueryの配列は`field[]=a&field[]=b`のような形式で渡されちゃうので、
    // req.queries("field[]")を使う
    // そうするとテストが・・・
    const statusFilters = statusFilterSchema.parse(
      req.queries(`${statusFilter}[]`),
    );

    const result = await db.query.tasks.findMany({
      where: and(
        eq(tasks.authorId, loggedInUserId),
        statusFilters?.length
          ? inArray(tasks.status, statusFilters)
          : undefined,
      ),
    });
    return json(result);
  },
);
