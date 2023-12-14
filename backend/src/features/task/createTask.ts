import { createRoute, z } from "@hono/zod-openapi";
import { TaskSchema } from "./schema";
import { route } from "../../app";
import { tasksTable } from "../../db/schema";
import { tasksPath } from "./path";

const CreateTaskInput = z
  .object({
    title: z.string().min(1).max(200),
    description: z.string().max(1000),
  })
  .openapi("CreateTaskInput");

const createTaskRoute = createRoute({
  method: "post",
  path: tasksPath,
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

export const createTask = route().openapi(
  createTaskRoute,
  async ({ req, var: { db }, json }) => {
    const { title, description } = req.valid("json");
    const created = (
      await db.insert(tasksTable).values({ title, description }).returning()
    )[0];

    return json(created);
  },
);
