import { Api } from "@/api/types";
import type {
  Method,
  ZodiosPathsByMethod,
  ZodiosRequestOptionsByPath,
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

export const createMswHandler = <
  M extends Method,
  Path extends ZodiosPathsByMethod<Api, M>,
>(
  method: M,
  path: Path,
  resolver: ResponseResolver<
    Record<string, unknown>,
    ZodiosRequestOptionsByPath<Api, M, Path>,
    Awaited<ZodiosResponseByPath<Api, M, Path>>
  >,
): HttpHandler => {
  return http[method](path, resolver);
};
