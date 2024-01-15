import { TaskTableFilter } from "./filter/filter";
import { useTaskTableFilter } from "./use-task-table-filter";
import { priorityColumnOptions } from "./columns/priority-column";
import { TaskTableFilterBadge } from "./filter/badge";
import { Separator } from "@/components/ui/separator";
import { statusColumnOptions } from "./columns/status-column";

export const TaskTableToolbar = () => {
  const { statusFilters, priorityFilters, removeFilter } = useTaskTableFilter();

  return (
    <div className="flex items-center gap-5 h-7">
      <TaskTableFilter />
      <Separator orientation="vertical" />
      <div className="flex items-center gap-2">
        {statusFilters.map((filter) => {
          const option = statusColumnOptions.filter(
            ({ value }) => value === filter,
          )[0];

          const removeStatusFilter = () => {
            removeFilter({ type: "status_filter", value: filter });
          };

          return (
            <TaskTableFilterBadge
              type="status"
              key={filter}
              label={option.label}
              onRemove={removeStatusFilter}
            />
          );
        })}
        {priorityFilters.map((filter) => {
          const option = priorityColumnOptions.find(
            (opt) => opt.value === filter,
          )!;

          const removePriorityFilter = () => {
            removeFilter({ type: "priority_filter", value: filter });
          };

          return (
            <TaskTableFilterBadge
              type="priority"
              key={filter}
              label={option.label}
              onRemove={removePriorityFilter}
            />
          );
        })}
      </div>
    </div>
  );
};
