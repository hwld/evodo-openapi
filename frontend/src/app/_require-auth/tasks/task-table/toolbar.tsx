import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { XIcon } from "lucide-react";
import { TaskTableStatusFilter } from "./status-filter";
import { Button } from "@/components/ui/button";
import { doneColumnOptions } from "./columns";
import { useTaskTableFilter } from "./use-task-table-filter";

export const TaskTableToolbar = () => {
  const { changeFilter, filters: statusFilters } = useTaskTableFilter({
    filterName: "status_filter",
  });

  return (
    <div className="flex items-center gap-5 h-7">
      <TaskTableStatusFilter />
      <Separator orientation="vertical" />
      <div className="flex items-center gap-2">
        {statusFilters.map((filter) => {
          const option = doneColumnOptions.filter(
            ({ value }) => value === filter,
          )[0];

          const removeFilter = () => {
            changeFilter(statusFilters.filter((f) => f !== filter));
          };

          return (
            <Badge variant="secondary" size="sm" key={String(filter)}>
              {option.label}
              <Button size="iconXs" variant="ghost" onClick={removeFilter}>
                <XIcon size={15} />
              </Button>
            </Badge>
          );
        })}
      </div>
    </div>
  );
};
