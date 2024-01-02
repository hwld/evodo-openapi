import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PlusCircleIcon } from "lucide-react";
import { statusColumnOptions } from "../-columns/status-column";
import { priorityColumnOptions } from "../-columns/priority-column";
import { useTaskTableFilter } from "../use-task-table-filter";
import { TaskTableFilterItem } from "./item";

export const TaskTableFilter: React.FC = () => {
  const { statusFilters, priorityFilters, toggleFilter, clearAllFilters } =
    useTaskTableFilter();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline">
          <div className="flex gap-1 items-center">
            <PlusCircleIcon size={15} />
            Filter
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup heading="状態">
              {statusColumnOptions.map(({ icon, label, value }) => {
                const isSelected = statusFilters.includes(value);

                const handleSelect = () => {
                  toggleFilter({ type: "status_filter", value });
                };

                return (
                  <TaskTableFilterItem
                    key={value}
                    isSelected={isSelected}
                    onSelect={handleSelect}
                    icon={icon}
                    label={label}
                  />
                );
              })}
            </CommandGroup>
            <CommandGroup heading="優先度">
              {priorityColumnOptions.map(({ icon, label, value }) => {
                const isSelected = priorityFilters.includes(value);

                const handleSelect = () => {
                  toggleFilter({ type: "priority_filter", value });
                };

                return (
                  <TaskTableFilterItem
                    key={value}
                    isSelected={isSelected}
                    onSelect={handleSelect}
                    icon={icon}
                    label={label}
                  />
                );
              })}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem onSelect={clearAllFilters}>
                フィルターを解除する
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
