import { Task } from "@/api/types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table } from "@tanstack/react-table";
import { XIcon } from "lucide-react";
import { TaskTableStatusFilter } from "./status-filter";
import { Button } from "@/components/ui/button";
import { doneColumnOptions } from "./columns";

type Props = { table: Table<Task> };
export const TaskTableToolbar: React.FC<Props> = ({ table }) => {
  const statusColumn = table.getColumn("status" satisfies keyof Task);
  const statusFilters =
    (statusColumn?.getFilterValue() as Task["status"][]) ?? [];

  return (
    <div className="flex items-center gap-5 h-7">
      <TaskTableStatusFilter table={table} />
      <Separator orientation="vertical" />
      <div className="flex items-center gap-2">
        {statusFilters.map((filter) => {
          const option = doneColumnOptions.filter(
            ({ value }) => value === filter,
          )[0];

          const clearFilter = () => {
            const newFilters = statusFilters.filter((f) => f !== filter);
            statusColumn?.setFilterValue(
              newFilters.length ? newFilters : undefined,
            );
          };

          return (
            <Badge variant="secondary" size="sm" key={String(filter)}>
              {option.label}
              <Button size="iconXs" variant="ghost" onClick={clearFilter}>
                <XIcon size={15} />
              </Button>
            </Badge>
          );
        })}
      </div>
    </div>
  );
};
