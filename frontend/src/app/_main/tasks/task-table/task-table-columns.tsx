/* eslint-disable react-hooks/rules-of-hooks */
import { api } from "@/api";
import { Task } from "@/api/types";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { toast } from "sonner";

const columnHelper = createColumnHelper<Task>();

export const columns = [
  // todo
  columnHelper.display({
    id: "status",
    cell: "undone",
    header: "Status",
  }),
  columnHelper.accessor("title", {
    header: "Title",
  }),
  columnHelper.accessor("createdAt", {
    header: "Created",
    cell: ({ getValue }) => {
      return <p className="whitespace-nowrap">{getValue()}</p>;
    },
  }),
  columnHelper.accessor("updatedAt", {
    header: "Updated",
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
          <Button size="sm" variant="outline" onClick={handleDeleteTask}>
            削除
          </Button>
        </div>
      );
    },
  }),
];
