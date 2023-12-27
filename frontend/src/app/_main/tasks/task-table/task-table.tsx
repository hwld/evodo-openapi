import { api } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const TaskTable: React.FC = () => {
  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      return await api.get("/tasks");
    },
  });

  const client = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async ({ taskId }: { taskId: string }) => {
      return api.delete("/tasks/:id", undefined, {
        params: { id: taskId },
      });
    },
    onError: async () => {
      toast.error("タスクを削除できませんでした。");
    },
    onSettled: async () => {
      await client.invalidateQueries();
    },
  });

  const handleDeleteTask = (id: string) => {
    deleteMutation.mutate({ taskId: id });
  };

  return (
    <div className="rounded border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(tasks?.length ?? 0) === 0 && (
            <TableRow className="pointer-events-none select-none">
              <TableCell colSpan={5}>
                <div className="flex flex-col justify-center items-center h-[300px]">
                  <p className="text-sm text-muted">タスクが存在しません。</p>
                </div>
              </TableCell>
            </TableRow>
          )}
          {tasks?.map((task) => {
            return (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>undone</TableCell>
                <TableCell>{task.createdAt}</TableCell>
                <TableCell>{task.updatedAt}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        handleDeleteTask(task.id);
                      }}
                    >
                      削除
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
