import { useQuery } from "@tanstack/react-query";
import { api } from "./api";

export const useSession = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      return await api.get("/session");
    },
  });

  return { session: data, isLoading, isError };
};
