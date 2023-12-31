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
import { useSortTaskTable } from "./use-sort-task-table";
import { Link } from "@tanstack/react-router";
import { tasksRoute } from "../page";

const columnHelper = createColumnHelper<Task>();

export const doneColumnOptions = [
  { value: "done", label: "完了", icon: CircleDotIcon },
  { value: "todo", label: "未完了", icon: CircleDashedIcon },
] as const;

export const taskTableColumns = [
  columnHelper.accessor("status", {
    filterFn: (row, id, value: unknown[]) => {
      return value.includes(row.getValue(id));
    },
    header: () => {
      const { sortStatus, toggleSorting } = useSortTaskTable("status");

      return (
        <Button
          variant="ghost"
          size="xs"
          onClick={() => {
            toggleSorting();
          }}
        >
          <div className="flex gap-1 items-center">
            状態
            <TaskTableSortedIcon sortStatus={sortStatus} />
          </div>
        </Button>
      );
    },
    cell: ({ getValue, row }) => {
      const status = getValue();

      const client = useQueryClient();
      const updateMutation = useMutation({
        mutationFn: async () => {
          return api.put(
            "/tasks/:id",
            {
              ...row.original,
              status: row.original.status === "done" ? "todo" : "done",
            },
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

      const option = doneColumnOptions.filter((opt) => opt.value === status)[0];
      const Icon = option.icon;
      const label = option.label;

      return (
        <Badge
          size="sm"
          onClick={() => updateMutation.mutate()}
          variant={status === "done" ? "success" : "destructive"}
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
    header: () => {
      const { sortStatus, toggleSorting } = useSortTaskTable("createdAt");

      return (
        <Button
          size="xs"
          variant="ghost"
          onClick={() => {
            toggleSorting();
          }}
        >
          <div className="flex items-center gap-1">
            作成日
            <TaskTableSortedIcon sortStatus={sortStatus} />
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
    header: () => {
      const { sortStatus, toggleSorting } = useSortTaskTable("updatedAt");

      return (
        <Button
          size="xs"
          variant="ghost"
          onClick={() => {
            toggleSorting();
          }}
        >
          <div className="flex items-center gap-1">
            更新日
            <TaskTableSortedIcon sortStatus={sortStatus} />
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
      const search = tasksRoute.useSearch();
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
        <div className="flex gap-2 items-center">
          <Link
            search={search}
            to="/tasks/$taskId"
            params={{ taskId: row.original.id }}
          >
            詳細
          </Link>
          <Button size="xs" variant="outline" onClick={handleDeleteTask}>
            削除
          </Button>
        </div>
      );
    },
  }),
];
