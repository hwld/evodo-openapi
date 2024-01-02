import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { XIcon } from "lucide-react";
import { TaskTableFilter } from "./filter";
import { Button } from "@/components/ui/button";
import { useTaskTableFilter } from "./use-task-table-filter";
import { statusColumnOptions } from "./-columns/status-column";
import { priorityColumnOptions } from "./-columns/priority-column";

export const TaskTableToolbar = () => {
  const {
    statusFilters,
    priorityFilters,
    changeStatusFilter,
    changePriorityFilter,
  } = useTaskTableFilter();

  return (
    <div className="flex items-center gap-5 h-7">
      <TaskTableFilter />
      <Separator orientation="vertical" />
      <div className="flex items-center gap-2">
        {statusFilters.map((filter) => {
          const option = statusColumnOptions.filter(
            ({ value }) => value === filter,
          )[0];

          const removeFilter = () => {
            changeStatusFilter(statusFilters.filter((f) => f !== filter));
          };

          return (
            <Badge variant="secondary" size="sm" key={filter}>
              <span className="text-muted-foreground mr-1">状態:</span>
              {option.label}
              <Button size="iconXs" variant="ghost" onClick={removeFilter}>
                <XIcon size={15} />
              </Button>
            </Badge>
          );
        })}
        {priorityFilters.map((filter) => {
          const option = priorityColumnOptions.find(
            (opt) => opt.value === filter,
          )!;

          const removeFilter = () => {
            changePriorityFilter(priorityFilters.filter((f) => f !== filter));
          };

          return (
            <Badge variant="secondary" size="sm" key={filter}>
              <span className="text-muted-foreground mr-1">優先度:</span>
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
