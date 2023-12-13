import { createRoute, z } from "@hono/zod-openapi";
import { TaskSchema } from "./schema";
import { tasks } from "../../db/schema";
import { route } from "../../app";

const getUsersRoute = createRoute({
  method: "get",
  path: "/",
  responses: {
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

export const findTasks = route().openapi(
  getUsersRoute,
  async ({ json, var: { db } }) => {
    const result = await db.select().from(tasks).all();
    return json(result);
  },
);
