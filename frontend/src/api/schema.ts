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
  .object({
    title: z.string().min(1).max(200),
    description: z.string().max(1000),
  })
  .passthrough();
const UpdateTaskInput = z
  .object({
    title: z.string().min(1).max(200),
    description: z.string().max(1000),
  })
  .passthrough();

export const schemas = {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/login/google",
    requestFormat: "json",
    response: z.void(),
    errors: [
      {
        status: 302,
        description: `GoogleのログインURLにリダイレクト`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/login/google/callback",
    requestFormat: "json",
    response: z.void(),
    errors: [
      {
        status: 302,
        description: `リダイレクト`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/logout",
    requestFormat: "json",
    response: z.void(),
  },
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
        schema: CreateTaskInput,
      },
    ],
    response: Task,
  },
  {
    method: "get",
    path: "/tasks/:id",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: Task,
  },
  {
    method: "delete",
    path: "/tasks/:id",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: Task,
  },
  {
    method: "put",
    path: "/tasks/:id",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UpdateTaskInput,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: Task,
  },
]);

export const _api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
