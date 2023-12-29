import { createRoute, z } from "@hono/zod-openapi";
import { TaskSchema, TaskStatusSchema } from "../schema";
import { tasks } from "../../../services/db/schema";
import { requireAuthRoute } from "../../../app";
import { tasksPath } from "../path";
import { Features } from "../../features";
import { errorResponse } from "../../../lib/openapi";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { LOGIN_SESSION_COOKIE } from "../../auth/consts";

const getTasksRoute = createRoute({
  tags: [Features.task],
  method: "get",
  path: tasksPath,
  summary: "全てのタスクを取得する",
  request: {
    cookies: z.object({
      [LOGIN_SESSION_COOKIE]: z.string().optional(),
    }),
    // フロントで使ってるzodiosでは配列のquery paramに[]を付ける必要がある
    query: z.object({
      ["status_filter[]"]: z
        .array(TaskStatusSchema)
        .or(TaskStatusSchema)
        .transform((v) => {
          if (typeof v === "string") {
            return [v];
          }
          return v;
        })
        .optional()
        .openapi("TaskStatusFilters"),
      sort: z
        .union([
          z.literal("title"),
          z.literal("status"),
          z.literal("createdAt"),
          z.literal("updatedAt"),
        ])
        .default("createdAt")
        .openapi("TaskSort"),
      order: z
        .union([z.literal("asc"), z.literal("desc")])
        .default("desc")
        .openapi("TaskSortOrder"),
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
    const statusFilters = req.valid("query")["status_filter[]"];
    const { sort, order } = req.valid("query");

    const sortMap = {
      title: tasks.title,
      status: tasks.status,
      createdAt: tasks.createdAt,
      updatedAt: tasks.updatedAt,
    };
    const orderFnMap = {
      asc: asc,
      desc: desc,
    };

    const result = await db.query.tasks.findMany({
      where: and(
        eq(tasks.authorId, loggedInUserId),
        statusFilters?.length
          ? inArray(tasks.status, statusFilters)
          : undefined,
      ),
      orderBy: [orderFnMap[order](sortMap[sort])],
    });
    return json(result);
  },
);
