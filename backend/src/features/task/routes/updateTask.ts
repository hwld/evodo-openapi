import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import { taskPath } from "../path";
import { TaskSchema } from "../schema";
import { route } from "../../../app";
import { tasks } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { Features } from "../../features";
import { errorResponse } from "../../../lib/openapi";

const UpdasteTaskInput = z
  .object({
    title: z.string().min(1).max(200),
    description: z.string().max(1000),
  })
  .openapi("UpdateTaskInput");

const UpdateTaskRoute = createRoute({
  tags: [Features.task],
  method: "put",
  path: taskPath,
  summary: "タスクを更新する",
  request: {
    params: z.object({
      id: z.string().openapi({ param: { name: "id", in: "path" } }),
    }),
    body: {
      content: {
        "application/json": {
          schema: UpdasteTaskInput,
        },
      },
    },
  },
  responses: {
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

export const updateTask = route().openapi(
  UpdateTaskRoute,
  async ({ json, var: { db }, req }) => {
    const taskId = req.valid("param").id;
    const { title, description } = req.valid("json");

    const result = await db
      .update(tasks)
      .set({ title, description })
      .where(eq(tasks.id, taskId))
      .returning();

    const updated = result[0];
    if (!updated) {
      throw new HTTPException(404, { message: "not found" });
    }

    return json(updated);
  },
);
