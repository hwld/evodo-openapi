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
import { cn } from "@/lib/utils";
import { CheckIcon, PlusCircleIcon } from "lucide-react";
import { statusColumnOptions } from "./-columns/status-column";
import { priorityColumnOptions } from "./-columns/priority-column";
import { useTaskTableFilter } from "./use-task-table-filter";

export const TaskTableFilter: React.FC = () => {
  const {
    statusFilters,
    priorityFilters,
    changeStatusFilter,
    changePriorityFilter,
    handleClearFilter,
  } = useTaskTableFilter();

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
              {statusColumnOptions.map(({ icon: Icon, label, value }, i) => {
                const isSelected = statusFilters.includes(value);

                const handleSelect = () => {
                  if (isSelected) {
                    changeStatusFilter(
                      statusFilters.filter((filter) => filter !== value),
                    );
                  } else {
                    changeStatusFilter([...statusFilters, value]);
                  }
                };

                return (
                  <CommandItem key={i} onSelect={handleSelect}>
                    <div
                      className={cn(
                        "h-4 w-4 border border-foreground rounded mr-3 flex justify-center items-center",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <CheckIcon size={14} />
                    </div>
                    <div className="flex gap-1 items-center text-foreground/80">
                      <Icon size={15} />
                      <span>{label}</span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandGroup heading="優先度">
              {priorityColumnOptions.map(({ icon: Icon, label, value }) => {
                const isSelected = priorityFilters.includes(value);

                const handleSelect = () => {
                  if (isSelected) {
                    changePriorityFilter(
                      priorityFilters.filter((filter) => filter !== value),
                    );
                  } else {
                    changePriorityFilter([...priorityFilters, value]);
                  }
                };

                return (
                  <CommandItem key={value} onSelect={handleSelect}>
                    <div
                      className={cn(
                        "h-4 w-4 border border-foreground rounded mr-3 flex justify-center items-center",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <CheckIcon size={14} />
                    </div>
                    <div className="flex gap-1 items-center text-foreground/80">
                      <Icon size={15} />
                      <span>{label}</span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem onSelect={handleClearFilter}>
                フィルターを解除する
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
