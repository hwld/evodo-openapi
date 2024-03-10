import { createTaskColumn } from ".";
import { useSortTaskTable } from "../use-sort-task-table";
import { Button } from "@/components/ui/button";
import { TaskTableSortedIcon } from "../sorted-icon";
import { Clock4Icon, HistoryIcon } from "lucide-react";

export const dateColumnOptions = {
  createdAt: { label: "作成日", icon: Clock4Icon },
  updatedAt: { label: "更新日", icon: HistoryIcon },
};

export const createTaskDateColumn = (type: "updatedAt" | "createdAt") => {
  return createTaskColumn.accessor(type, {
    size: 0,
    minSize: 0,
    header: function Header() {
      const { sortStatus, toggleSorting } = useSortTaskTable(type);

      const { label, icon: Icon } = dateColumnOptions[type];

      return (
        <Button
          size="xs"
          variant="ghost"
          onClick={() => {
            toggleSorting();
          }}
        >
          <div className="flex items-center gap-1">
            <Icon size={15} />
            {label}
            <TaskTableSortedIcon sortStatus={sortStatus} />
          </div>
        </Button>
      );
    },
    cell: function Cell({ getValue }) {
      return <p className="whitespace-nowrap">{getValue()}</p>;
    },
  });
};
