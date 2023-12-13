/**
 * Generated by orval v6.22.1 🍺
 * Do not edit manually.
 * My API
 * OpenAPI spec version: 1.0.0
 */
import { useQuery } from "@tanstack/react-query";
import type {
  QueryFunction,
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import * as axios from "axios";
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import type { User } from "./index.schemas";

export const getUsers = (
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<User[]>> => {
  return axios.default.get(`/users`, options);
};

export const getGetUsersQueryKey = () => {
  return [`/users`] as const;
};

export const getGetUsersQueryOptions = <
  TData = Awaited<ReturnType<typeof getUsers>>,
  TError = AxiosError<unknown>,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>
  >;
  axios?: AxiosRequestConfig;
}) => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetUsersQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getUsers>>> = ({
    signal,
  }) => getUsers({ signal, ...axiosOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getUsers>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetUsersQueryResult = NonNullable<
  Awaited<ReturnType<typeof getUsers>>
>;
export type GetUsersQueryError = AxiosError<unknown>;

export const useGetUsers = <
  TData = Awaited<ReturnType<typeof getUsers>>,
  TError = AxiosError<unknown>,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>
  >;
  axios?: AxiosRequestConfig;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetUsersQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
};
