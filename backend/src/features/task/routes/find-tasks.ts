import { createRoute, z } from "@hono/zod-openapi";
import { TaskPrioritySchema, TaskSchema, TaskStatusSchema } from "../schema";
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
      ["priority_filter[]"]: z
        .array(TaskPrioritySchema)
        .or(TaskPrioritySchema)
        .transform((v) => {
          if (typeof v === "string") {
            return [v];
          }
          return v;
        })
        .optional()
        .openapi("TaskPriorityFilters"),
      sort: z
        .union([
          z.literal("title"),
          z.literal("priority"),
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
      page: z
        .string()
        .transform((v) => {
          const n = Number(v);
          if (isNaN(n)) {
            return 1;
          }
          return n;
        })
        .default("1"),
    }),
  },
  responses: {
    ...errorResponse(400),
    ...errorResponse(500),
    200: {
      content: {
        "application/json": {
          schema: z
            .object({
              tasks: z.array(TaskSchema),
              totalPages: z.number(),
            })
            .openapi("TaskPageEntry"),
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
    const priorityFilters = req.valid("query")["priority_filter[]"];
    const { sort, order, page } = req.valid("query");
    const limit = 20;

    const sortMap = {
      title: tasks.title,
      priority: tasks.priority,
      status: tasks.status,
      createdAt: tasks.createdAt,
      updatedAt: tasks.updatedAt,
    };
    const orderFnMap = {
      asc: asc,
      desc: desc,
    };

    const where = and(
      eq(tasks.authorId, loggedInUserId),
      statusFilters?.length ? inArray(tasks.status, statusFilters) : undefined,
      priorityFilters?.length
        ? inArray(tasks.priority, priorityFilters)
        : undefined,
    );

    const allTasks = (await db.query.tasks.findMany({ where })).length;
    const totalPages = Math.ceil(allTasks / limit);

    const taskPage = await db.query.tasks.findMany({
      where,
      limit,
      offset: (page - 1) * limit,
      orderBy: [orderFnMap[order](sortMap[sort]), desc(tasks.id)],
    });

    return json({ tasks: taskPage, totalPages });
  },
);
