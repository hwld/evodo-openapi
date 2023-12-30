import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const SignupInput = z.object({
  username: z.string().min(1).max(100),
  profile: z.string().max(1000),
});
const User = z.object({ id: z.string(), name: z.string() });
const Session = z.object({ user: User });
const status_filter_ = z
  .union([
    z.array(z.union([z.literal("todo"), z.literal("done")])),
    z.literal("todo"),
    z.literal("done"),
  ])
  .optional();
const sort = z
  .union([
    z.literal("title"),
    z.literal("status"),
    z.literal("createdAt"),
    z.literal("updatedAt"),
  ])
  .default("createdAt");
const order = z.union([z.literal("asc"), z.literal("desc")]).default("desc");
const Task = z.object({
  id: z.string(),
  title: z.string(),
  status: z.union([z.literal("todo"), z.literal("done")]),
  description: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
const TaskPageEntry = z.object({
  tasks: z.array(Task),
  totalPages: z.number(),
});
const CreateTaskInput = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000),
});
const UpdateTaskInput = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000),
  status: z.union([z.literal("todo"), z.literal("done")]),
});
const TaskStatusFilters = z.union([
  z.array(z.union([z.literal("todo"), z.literal("done")])),
  z.literal("todo"),
  z.literal("done"),
]);
const TaskSort = z.union([
  z.literal("title"),
  z.literal("status"),
  z.literal("createdAt"),
  z.literal("updatedAt"),
]);
const TaskSortOrder = z.union([z.literal("asc"), z.literal("desc")]);

export const schemas = {
  SignupInput,
  User,
  Session,
  status_filter_,
  sort,
  order,
  Task,
  TaskPageEntry,
  CreateTaskInput,
  UpdateTaskInput,
  TaskStatusFilters,
  TaskSort,
  TaskSortOrder,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/login/google",
    requestFormat: "json",
    parameters: [
      {
        name: "after_login_redirect",
        type: "Query",
        schema: z
          .string()
          .regex(/^\/(?!\/).*$/)
          .optional(),
      },
      {
        name: "signup_redirect",
        type: "Query",
        schema: z
          .string()
          .regex(/^\/(?!\/).*$/)
          .optional(),
      },
      {
        name: "error_redirect",
        type: "Query",
        schema: z
          .string()
          .regex(/^\/(?!\/).*$/)
          .optional(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 302,
        description: `リダイレクト`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `内部エラー`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/login/google/callback",
    description: `ユーザーが登録されていればログインセッションを作成し、ログイン後の画面にリダイレクトする。  
    ユーザーが登録されていなければ新規登録セッションを作成し、新規登録画面にリダイレクトする。  
    ※ユーザーからは呼び出さない。`,
    requestFormat: "json",
    parameters: [
      {
        name: "code",
        type: "Query",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 302,
        description: `リダイレクト`,
        schema: z.void(),
      },
      {
        status: 400,
        description: `不正なリクエスト`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `認証情報の不足`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `内部エラー`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/logout",
    requestFormat: "json",
    response: z.object({}).partial(),
    errors: [
      {
        status: 500,
        description: `内部エラー`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/session",
    requestFormat: "json",
    response: z.object({ session: Session.nullable() }),
    errors: [
      {
        status: 500,
        description: `内部エラー`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/signup",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: SignupInput,
      },
    ],
    response: z.object({ userId: z.string() }),
    errors: [
      {
        status: 400,
        description: `不正なリクエスト`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `認証情報の不足`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `内部エラー`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/signup-session",
    requestFormat: "json",
    response: z.object({ exists: z.boolean() }),
    errors: [
      {
        status: 500,
        description: `内部エラー`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/signup/cancel",
    description: `新規登録セッションを破棄して新規登録をキャンセルする`,
    requestFormat: "json",
    response: z.object({}).partial(),
    errors: [
      {
        status: 400,
        description: `不正なリクエスト`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `内部エラー`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/tasks",
    requestFormat: "json",
    parameters: [
      {
        name: "status_filter[]",
        type: "Query",
        schema: status_filter_,
      },
      {
        name: "sort",
        type: "Query",
        schema: sort,
      },
      {
        name: "order",
        type: "Query",
        schema: order,
      },
      {
        name: "page",
        type: "Query",
        schema: z.string().default("1"),
      },
    ],
    response: TaskPageEntry,
    errors: [
      {
        status: 500,
        description: `内部エラー`,
        schema: z.void(),
      },
    ],
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
    errors: [
      {
        status: 400,
        description: `不正なリクエスト`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `内部エラー`,
        schema: z.void(),
      },
    ],
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
    errors: [
      {
        status: 400,
        description: `不正なリクエスト`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `タスクが存在しない`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `内部エラー`,
        schema: z.void(),
      },
    ],
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
    errors: [
      {
        status: 400,
        description: `不正なリクエスト`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `タスクが存在しない`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `内部エラー`,
        schema: z.void(),
      },
    ],
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
    errors: [
      {
        status: 400,
        description: `不正なリクエスト`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `タスクが存在しない`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `内部エラー`,
        schema: z.void(),
      },
    ],
  },
]);

export const _api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
