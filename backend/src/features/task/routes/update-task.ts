import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import { taskPath } from "../path";
import { TaskSchema, UpdasteTaskInputSchema } from "../schema";
import { requireAuthRoute, route } from "../../../app";
import { tasks } from "../../../services/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { Features } from "../../features";
import { errorResponse } from "../../../lib/openapi";
import { LOGIN_SESSION_COOKIE } from "../../auth/consts";
import { currentTime } from "../../../services/db/utils";

const updateTaskRoute = createRoute({
  tags: [Features.task],
  method: "put",
  path: taskPath,
  summary: "タスクを更新する",
  request: {
    cookies: z.object({
      [LOGIN_SESSION_COOKIE]: z.string().optional(),
    }),
    params: z.object({
      id: z.string().openapi({ param: { name: "id", in: "path" } }),
    }),
    body: {
      content: {
        "application/json": {
          schema: UpdasteTaskInputSchema,
        },
      },
    },
  },
  responses: {
    ...errorResponse(400),
    ...errorResponse(404, "タスクが存在しない"),
    ...errorResponse(500),
    200: {
      description: "更新後のタスクを返す",
      content: {
        "application/json": {
          schema: TaskSchema,
        },
      },
    },
  },
});

export const updateTask = requireAuthRoute(updateTaskRoute.path).openapi(
  updateTaskRoute,
  async ({ json, var: { db, loggedInUserId }, req }) => {
    const taskId = req.valid("param").id;
    const { title, description, status } = req.valid("json");

    const [updated] = await db
      .update(tasks)
      .set({
        title,
        description,
        status,
        updatedAt: currentTime(),
      })
      .where(and(eq(tasks.id, taskId), eq(tasks.authorId, loggedInUserId)))
      .returning();

    if (!updated) {
      throw new HTTPException(404, { message: "not found" });
    }

    return json(updated);
  },
);
