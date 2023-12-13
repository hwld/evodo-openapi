import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const User = z
  .object({
    id: z.string(),
    name: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .passthrough();
const CreateUserInput = z
  .object({ name: z.string().min(1).max(200) })
  .passthrough();

export const schemas = {
  User,
  CreateUserInput,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/users",
    requestFormat: "json",
    response: z.array(User),
  },
  {
    method: "post",
    path: "/users",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ name: z.string().min(1).max(200) }).passthrough(),
      },
    ],
    response: User,
  },
]);

export const _api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
