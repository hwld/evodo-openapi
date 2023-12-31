import { createRoute, z } from "@hono/zod-openapi";
import { CreateTaskInputSchema, TaskSchema } from "../schema";
import { requireAuthRoute } from "../../../app";
import { tasks } from "../../../services/db/schema";
import { tasksPath } from "../path";
import { Features } from "../../features";
import { errorResponse } from "../../../lib/openapi";
import { LOGIN_SESSION_COOKIE } from "../../auth/consts";

const createTaskRoute = createRoute({
  tags: [Features.task],
  method: "post",
  path: tasksPath,
  summary: "タスクを作成する",
  request: {
    cookies: z.object({
      [LOGIN_SESSION_COOKIE]: z.string().optional(),
    }),
    body: {
      content: {
        "application/json": {
          schema: CreateTaskInputSchema,
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

export const createTask = requireAuthRoute(createTaskRoute.path).openapi(
  createTaskRoute,
  async ({ req, var: { db, loggedInUserId }, json }) => {
    const { title } = req.valid("json");
    const [created] = await db
      .insert(tasks)
      .values({ title, description: "", authorId: loggedInUserId })
      .returning();

    return json(created);
  },
);
