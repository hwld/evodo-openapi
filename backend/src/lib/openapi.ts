import { createRoute, z } from "@hono/zod-openapi";

type ResponseOption = Parameters<typeof createRoute>[0]["responses"];

const defaultDescriptionMap = {
  500: "内部エラー",
  400: "不正なリクエスト",
  401: "認証情報の不足",
  404: "存在しないリソース",
} as { [T in number]: string };

export const errorResponse = (status: number, description?: string) => {
  return {
    [status]: {
      description: description ?? defaultDescriptionMap[status] ?? "Error",
      content: {
        "text/plain": {
          schema: z.string().openapi({ example: "Error message" }),
        },
      },
    },
  } satisfies ResponseOption;
};
