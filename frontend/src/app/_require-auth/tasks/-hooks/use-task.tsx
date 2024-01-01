import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useTask = ({ taskId }: { taskId: string }) => {
  const { data: task } = useQuery({
    queryKey: ["tasks", taskId],
    queryFn: () => {
      return api.get("/tasks/:id", { params: { id: taskId } });
    },
  });

  return { task };
};
