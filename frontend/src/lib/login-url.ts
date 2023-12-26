import { api } from "@/api";
import { ZodiosRequestOptions } from "@zodios/core";

const buildLoginUrl = () => {
  type API = typeof api.api;
  type Q = keyof NonNullable<
    ZodiosRequestOptions<API, "get", "/login/google">["queries"]
  >;

  const url = new URL(`${import.meta.env.VITE_API_URL}/login/google`);
  url.searchParams.set("after_login_redirect" satisfies Q, "/");
  url.searchParams.set("signup_redirect" satisfies Q, "/auth/signup");
  url.searchParams.set("error_redirect" satisfies Q, "/auth/error");

  return url.toString();
};

export const LOGIN_URL = buildLoginUrl();
