import { Button } from "@/components/ui/button";
import {
  ArrowUpDownIcon,
  CircleIcon,
  PlusCircleIcon,
  XCircleIcon,
} from "lucide-react";
import { statusColumnOptions } from "../columns/status-column";
import { priorityColumnOptions } from "../columns/priority-column";
import { useTaskTableFilter } from "../use-task-table-filter";
import { TaskTableFilterItem } from "./item";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

export const TaskTableFilter: React.FC = () => {
  const { statusFilters, priorityFilters, toggleFilter, clearAllFilters } =
    useTaskTableFilter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline">
          <div className="flex gap-1 items-center">
            <PlusCircleIcon size={15} />
            Filter
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px] space-y-2">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-muted-foreground">
            <div className="flex gap-1 items-center">
              <CircleIcon size={15} />
              <p>状態</p>
            </div>
          </DropdownMenuLabel>
          <Separator className="mb-1" />
          {statusColumnOptions.map(({ icon, label, value }) => {
            const isSelected = statusFilters.includes(value);

            const handleSelect = () => {
              toggleFilter({ type: "status_filter", value });
            };
            return (
              <TaskTableFilterItem
                key={value}
                icon={icon}
                label={label}
                isSelected={isSelected}
                onSelect={handleSelect}
              />
            );
          })}
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-muted-foreground">
            <div className="flex items-center gap-1">
              <ArrowUpDownIcon size={15} />
              <p>優先度</p>
            </div>
          </DropdownMenuLabel>
          <Separator className="mb-1" />
          {priorityColumnOptions.map(({ icon, label, value }) => {
            const isSelected = priorityFilters.includes(value);

            const handleSelect = () => {
              toggleFilter({ type: "priority_filter", value });
            };
            return (
              <TaskTableFilterItem
                key={value}
                icon={icon}
                label={label}
                isSelected={isSelected}
                onSelect={handleSelect}
              />
            );
          })}
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <Separator className="mb-1" />
          <DropdownMenuItem onSelect={clearAllFilters}>
            <div className="flex items-center gap-1 ">
              <XCircleIcon size={18} />
              フィルターを解除する
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
