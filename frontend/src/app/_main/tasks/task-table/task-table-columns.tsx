/* eslint-disable react-hooks/rules-of-hooks */
import { api } from "@/api";
import { Task } from "@/api/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { toast } from "sonner";

const columnHelper = createColumnHelper<Task>();

export const columns = [
  columnHelper.accessor("done", {
    header: "状態",
    cell: ({ getValue, row }) => {
      const done = getValue();

      const client = useQueryClient();
      const updateMutation = useMutation({
        mutationFn: async () => {
          return api.put(
            "/tasks/:id",
            { ...row.original, done: !row.original.done },
            { params: { id: row.original.id } },
          );
        },
        onError: () => {
          toast.error("タスクを更新できませんでした。");
        },
        onSettled: async () => {
          await client.invalidateQueries();
        },
      });

      return (
        <Badge
          button
          onClick={() => updateMutation.mutate()}
          variant={done ? "success" : "destructive"}
        >
          {done ? "完了" : "未完了"}
        </Badge>
      );
    },
  }),
  columnHelper.accessor("title", {
    header: "タスク",
    cell: ({ getValue }) => {
      return <p className="whitespace-nowrap">{getValue()}</p>;
    },
  }),
  columnHelper.accessor("createdAt", {
    header: "作成日",
    cell: ({ getValue }) => {
      return <p className="whitespace-nowrap">{getValue()}</p>;
    },
  }),
  columnHelper.accessor("updatedAt", {
    header: "更新日",
    cell: ({ getValue }) => {
      return <p className="whitespace-nowrap">{getValue()}</p>;
    },
  }),
  columnHelper.display({
    id: "action",
    cell: ({ row }) => {
      const client = useQueryClient();
      const deleteMutation = useMutation({
        mutationFn: async () => {
          return api.delete("/tasks/:id", undefined, {
            params: { id: row.original.id },
          });
        },
        onError: async () => {
          toast.error("タスクを削除できませんでした。");
        },
        onSettled: async () => {
          await client.invalidateQueries();
        },
      });

      const handleDeleteTask = () => {
        deleteMutation.mutate();
      };

      return (
        <div className="flex">
          <Button size="xs" variant="outline" onClick={handleDeleteTask}>
            削除
          </Button>
        </div>
      );
    },
  }),
];
