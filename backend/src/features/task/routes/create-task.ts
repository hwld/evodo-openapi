import { createRoute, z } from "@hono/zod-openapi";
import { TaskSchema } from "../schema";
import { route } from "../../../app";
import { tasks } from "../../../services/db/schema";
import { tasksPath } from "../path";
import { Features } from "../../features";
import { errorResponse } from "../../../lib/openapi";

const CreateTaskInput = z
  .object({
    title: z.string().min(1).max(200),
    description: z.string().max(1000),
  })
  .openapi("CreateTaskInput");

const createTaskRoute = createRoute({
  tags: [Features.task],
  method: "post",
  path: tasksPath,
  summary: "タスクを作成する",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateTaskInput,
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
          schema: TaskSchema,
        },
      },
      description: "作成成功",
    },
  },
});

export const createTask = route(createTaskRoute.path).openapi(
  createTaskRoute,
  async ({ req, var: { db }, json }) => {
    const { title, description } = req.valid("json");
    const [created] = await db
      .insert(tasks)
      .values({ title, description })
      .returning();

    return json(created);
  },
);
