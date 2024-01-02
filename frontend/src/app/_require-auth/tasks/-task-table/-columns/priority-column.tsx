import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
} from "lucide-react";
import { createTaskColumn } from ".";
import { Button } from "@/components/ui/button";
import { TaskTableSortedIcon } from "../sorted-icon";
import { useSortTaskTable } from "../use-sort-task-table";
import { useUpdateTask } from "../../-hooks/use-update-task";
import { Task } from "@/api/types";
import { TaskPriorityBadge } from "../../task-priority-badge";

export const priorityColumnOptions = [
  { value: "1", label: "低い", icon: ArrowDownIcon },
  { value: "2", label: "普通", icon: ArrowRightIcon },
  { value: "3", label: "高い", icon: ArrowUpIcon },
] as const;

export const taskPriorityColumn = createTaskColumn.accessor("priority", {
  header: function Header() {
    const { sortStatus, toggleSorting } = useSortTaskTable("priority");

    return (
      <Button variant="ghost" size="xs" onClick={toggleSorting}>
        <div className="flex gap-1 items-center">
          <ArrowUpDownIcon size={15} />
          <p>優先度</p>
          <TaskTableSortedIcon sortStatus={sortStatus} />
        </div>
      </Button>
    );
  },
  cell: function Cell({ getValue, row }) {
    const priority = getValue();
    const updateMutation = useUpdateTask();

    const handleUpdateTaskPriority = (newPriority: Task["priority"]) => {
      updateMutation.mutate({
        ...row.original,
        taskId: row.original.id,
        priority: newPriority,
      });
    };

    return (
      <TaskPriorityBadge
        size="sm"
        priority={priority}
        onPriorityChange={handleUpdateTaskPriority}
        disabled={updateMutation.isPending}
      />
    );
  },
});
