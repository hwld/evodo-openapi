import { Tooltip } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { PanelRightIcon, TrashIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { tasksRoute } from "../../page";
import { createTaskColumn } from ".";
import { useDeleteTask } from "../../-hooks/use-delete-task";

export const TaskActionColumn = createTaskColumn.display({
  id: "action",
  cell: function Cell({ row }) {
    const search = tasksRoute.useSearch();
    const deleteMutation = useDeleteTask();

    const handleDeleteTask = () => {
      deleteMutation.mutate({ taskId: row.original.id });
    };

    return (
      <div className="flex gap-2 items-center">
        <Tooltip label="タスクの詳細を表示する">
          <Button size="icon" variant="outline" asChild>
            <Link
              search={search}
              to="/tasks/$taskId"
              params={{ taskId: row.original.id }}
            >
              <PanelRightIcon size={16} />
            </Link>
          </Button>
        </Tooltip>
        <Tooltip label="タスクを削除する">
          <Button size="icon" variant="outline" onClick={handleDeleteTask}>
            <TrashIcon size={16} />
          </Button>
        </Tooltip>
      </div>
    );
  },
});
