import { createTaskColumn } from ".";
import { useSortTaskTable } from "../use-sort-task-table";
import { Button } from "@/components/ui/button";
import { TaskTableSortedIcon } from "../sorted-icon";

export const createTaskDateColumn = (type: "updatedAt" | "createdAt") => {
  const labelMap = { createdAt: "作成日", updatedAt: "更新日" };

  return createTaskColumn.accessor(type, {
    header: function Header() {
      const { sortStatus, toggleSorting } = useSortTaskTable(type);

      return (
        <Button
          size="xs"
          variant="ghost"
          onClick={() => {
            toggleSorting();
          }}
        >
          <div className="flex items-center gap-1">
            {labelMap[type]}
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
