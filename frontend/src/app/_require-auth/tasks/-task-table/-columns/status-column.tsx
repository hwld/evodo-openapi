import { Button } from "@/components/ui/button";
import { createTaskColumn } from ".";
import { useSortTaskTable } from "../use-sort-task-table";
import { TaskTableSortedIcon } from "../sorted-icon";
import { CircleDashedIcon, CircleDotIcon, CircleIcon } from "lucide-react";
import { useUpdateTask } from "../../-hooks/use-update-task";
import { TaskStatusBadge } from "../../task-status-badge";

export const statusColumnOptions = [
  { value: "done", label: "完了", icon: CircleDotIcon },
  { value: "todo", label: "未完了", icon: CircleDashedIcon },
] as const;

export const taskStatusColumn = createTaskColumn.accessor("status", {
  size: 0,
  minSize: 0,
  header: function Header() {
    const { sortStatus, toggleSorting } = useSortTaskTable("status");

    return (
      <Button variant="ghost" size="xs" onClick={toggleSorting}>
        <div className="flex gap-1 items-center">
          <CircleIcon size={15} />
          <p>状態</p>
          <TaskTableSortedIcon sortStatus={sortStatus} />
        </div>
      </Button>
    );
  },
  cell: function Cell({ getValue, row }) {
    const status = getValue();
    const updateMutation = useUpdateTask();

    const handleUpdateTaskStatus = () => {
      updateMutation.mutate({
        ...row.original,
        status: row.original.status === "done" ? "todo" : "done",
        taskId: row.original.id,
      });
    };

    return (
      <TaskStatusBadge
        size="sm"
        onClick={handleUpdateTaskStatus}
        status={status}
        disabled={updateMutation.isPending}
      />
    );
  },
});
