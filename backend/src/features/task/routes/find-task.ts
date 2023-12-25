import { createRoute, z } from "@hono/zod-openapi";
import { taskPath } from "../path";
import { TaskSchema } from "../schema";
import { requireAuthRoute, route } from "../../../app";
import { and, eq } from "drizzle-orm";
import { tasks } from "../../../services/db/schema";
import { HTTPException } from "hono/http-exception";
import { Features } from "../../features";
import { errorResponse } from "../../../lib/openapi";
import { LOGIN_SESSION_COOKIE } from "../../auth/consts";

const getTaskRoute = createRoute({
  tags: [Features.task],
  method: "get",
  path: taskPath,
  summary: "タスクを取得する",
  request: {
    cookies: z.object({
      [LOGIN_SESSION_COOKIE]: z.string().optional(),
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
      content: {
        "application/json": {
          schema: TaskSchema,
        },
      },
      description: "取得成功",
    },
  },
});

export const findTask = requireAuthRoute(getTaskRoute.path).openapi(
  getTaskRoute,
  async ({ req, json, var: { db, loggedInUserId } }) => {
    const taskId = req.valid("param").id;
    const task = await db.query.tasks.findFirst({
      where: and(eq(tasks.id, taskId), eq(tasks.authorId, loggedInUserId)),
    });

    if (!task) {
      throw new HTTPException(404, { message: "not found" });
    }

    return json(task);
  },
);
