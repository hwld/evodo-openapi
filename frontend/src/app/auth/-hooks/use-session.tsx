import { api } from "@/api";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

export const sessionQueryOptions = queryOptions({
  queryKey: ["session"],
  queryFn: async () => {
    const result = await api.get("/session");
    return result.session;
  },
});

export const useSession = () => {
  const { data: session } = useSuspenseQuery(sessionQueryOptions);
  return { session };
};
