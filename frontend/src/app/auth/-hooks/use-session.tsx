import { api } from "@/api";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useSession = () => {
  const { data: session } = useSuspenseQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const result = await api.get("/session");
      return result.session;
    },
  });

  return { session };
};
