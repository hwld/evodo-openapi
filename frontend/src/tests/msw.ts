import { Api } from "@/api/types";
import type {
  ZodiosBodyByPath,
  ZodiosPathsByMethod,
  ZodiosResponseByPath,
} from "@zodios/core";
import { http, HttpHandler, RequestHandler, ResponseResolver } from "msw";
import { setupServer } from "msw/node";

export const setupMockServer = (...handlers: RequestHandler[]) => {
  const server = setupServer(...handlers);
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  return server;
};

// ZodiosPathsByMethodのMethodの部分など、Methoを型引数にするとTypeScriptの補完が重たくなるのと、
// resolverの返り値の型が効かなくなるので、Methodごとにハンドラを作る関数を用意する。

export const createGetHandler = <Path extends ZodiosPathsByMethod<Api, "get">>(
  path: Path,
  resolver: ResponseResolver<
    Record<string, unknown>,
    ZodiosBodyByPath<Api, "get", Path>,
    Awaited<ZodiosResponseByPath<Api, "get", Path>>
  >,
): HttpHandler => {
  const url = new URL(path, import.meta.env.VITE_API_URL);
  return http.get(url.toString(), resolver);
};

export const createPostHandler = <
  Path extends ZodiosPathsByMethod<Api, "post">,
>(
  path: Path,
  resolver: ResponseResolver<
    Record<string, unknown>,
    ZodiosBodyByPath<Api, "post", Path>,
    Awaited<ZodiosResponseByPath<Api, "post", Path>>
  >,
): HttpHandler => {
  const url = new URL(path, import.meta.env.VITE_API_URL);
  return http.post(url.toString(), resolver);
};

export const createDeleteHandler = <
  Path extends ZodiosPathsByMethod<Api, "delete">,
>(
  path: Path,
  resolver: ResponseResolver<
    Record<string, unknown>,
    ZodiosBodyByPath<Api, "delete", Path>,
    Awaited<ZodiosResponseByPath<Api, "delete", Path>>
  >,
): HttpHandler => {
  const url = new URL(path, import.meta.env.VITE_API_URL);
  return http.delete(url.toString(), resolver);
};
