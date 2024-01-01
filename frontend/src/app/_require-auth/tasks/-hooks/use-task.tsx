import { api } from "@/api";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useTask = ({ taskId }: { taskId: string }) => {
  const { data: task } = useSuspenseQuery({
    queryKey: ["tasks", taskId],
    queryFn: () => {
      return api.get("/tasks/:id", { params: { id: taskId } });
    },
  });

  return { task };
};
