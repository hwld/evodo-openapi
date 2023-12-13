import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const Task = z
  .object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .passthrough();
const CreateTaskInput = z
  .object({ title: z.string().min(1).max(200) })
  .passthrough();

export const schemas = {
  Task,
  CreateTaskInput,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/tasks",
    requestFormat: "json",
    response: z.array(Task),
  },
  {
    method: "post",
    path: "/tasks",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ title: z.string().min(1).max(200) }).passthrough(),
      },
    ],
    response: Task,
  },
]);

export const _api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
