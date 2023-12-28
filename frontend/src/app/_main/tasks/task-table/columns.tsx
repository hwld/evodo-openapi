/* eslint-disable react-hooks/rules-of-hooks */
import { api } from "@/api";
import { Task } from "@/api/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { toast } from "sonner";
import { TaskTableSortedIcon } from "./sorted-icon";
import { CircleDashedIcon, CircleDotIcon } from "lucide-react";

const columnHelper = createColumnHelper<Task>();

export const doneColumnOptions = [
  { value: true, label: "完了", icon: CircleDotIcon },
  { value: false, label: "未完了", icon: CircleDashedIcon },
] as const;

export const taskTableColumns = [
  columnHelper.accessor("done", {
    filterFn: (row, id, value: unknown[]) => {
      return value.includes(row.getValue(id));
    },
    header: ({ column }) => {
      const sorted = column.getIsSorted();

      return (
        <Button
          variant="ghost"
          size="xs"
          onClick={() => {
            column.toggleSorting(sorted === "asc");
          }}
        >
          <div className="flex gap-1 items-center">
            状態
            <TaskTableSortedIcon sorted={sorted} />
          </div>
        </Button>
      );
    },
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

      const option = doneColumnOptions.filter((opt) => opt.value === done)[0];
      const Icon = option.icon;
      const label = option.label;

      return (
        <Badge
          size="sm"
          onClick={() => updateMutation.mutate()}
          variant={done ? "success" : "destructive"}
        >
          <Icon size={13} className="mr-1" />
          {label}
        </Badge>
      );
    },
  }),

  columnHelper.accessor("title", {
    header: "タスク",
    cell: ({ getValue }) => {
      return <p>{getValue()}</p>;
    },
  }),

  columnHelper.accessor("createdAt", {
    sortingFn: (a, b) => {
      return (
        new Date(b.original.createdAt).getTime() -
        new Date(a.original.createdAt).getTime()
      );
    },
    header: ({ column }) => {
      const sorted = column.getIsSorted();

      return (
        <Button
          size="xs"
          variant="ghost"
          onClick={() => {
            column.toggleSorting(sorted === "asc");
          }}
        >
          <div className="flex items-center gap-1">
            作成日
            <TaskTableSortedIcon sorted={sorted} />
          </div>
        </Button>
      );
    },
    cell: ({ getValue }) => {
      return <p className="whitespace-nowrap">{getValue()}</p>;
    },
  }),

  columnHelper.accessor("updatedAt", {
    sortingFn: (a, b) => {
      return (
        new Date(b.original.createdAt).getTime() -
        new Date(a.original.createdAt).getTime()
      );
    },
    header: ({ column }) => {
      const sorted = column.getIsSorted();

      return (
        <Button
          size="xs"
          variant="ghost"
          onClick={() => {
            column.toggleSorting(sorted === "asc");
          }}
        >
          <div className="flex items-center gap-1">
            更新日
            <TaskTableSortedIcon sorted={sorted} />
          </div>
        </Button>
      );
    },
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
