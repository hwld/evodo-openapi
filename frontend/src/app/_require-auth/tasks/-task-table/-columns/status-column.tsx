import { Button } from "@/components/ui/button";
import { createTaskColumn } from ".";
import { useSortTaskTable } from "../use-sort-task-table";
import { TaskTableSortedIcon } from "../sorted-icon";
import { Badge } from "@/components/ui/badge";
import { CircleDashedIcon, CircleDotIcon } from "lucide-react";
import { useUpdateTask } from "../../-hooks/use-update-task";

export const doneColumnOptions = [
  { value: "done", label: "完了", icon: CircleDotIcon },
  { value: "todo", label: "未完了", icon: CircleDashedIcon },
] as const;

export const taskStatusColumn = createTaskColumn.accessor("status", {
  header: function Header() {
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

    const option = doneColumnOptions.filter((opt) => opt.value === status)[0];
    const Icon = option.icon;
    const label = option.label;

    return (
      <Badge
        size="sm"
        onClick={handleUpdateTaskStatus}
        variant={status === "done" ? "success" : "destructive"}
      >
        <Icon size={13} className="mr-1" />
        {label}
      </Badge>
    );
  },
});
