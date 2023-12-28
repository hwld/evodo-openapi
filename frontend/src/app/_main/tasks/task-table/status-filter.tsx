import { Task } from "@/api/types";
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
import { Table } from "@tanstack/react-table";
import { CheckIcon, PlusCircleIcon } from "lucide-react";
import { doneColumnOptions } from "./columns";

type Props = { table: Table<Task> };
export const TaskTableStatusFilter: React.FC<Props> = ({ table }) => {
  const statusColumn = table.getColumn("status" satisfies keyof Task);
  const statusFilters =
    (statusColumn?.getFilterValue() as Task["status"][]) ?? [];

  const options = doneColumnOptions;

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
            <CommandGroup>
              {options.map(({ icon: Icon, label, value }, i) => {
                const isSelected = statusFilters.includes(value);

                return (
                  <CommandItem
                    key={i}
                    onSelect={() => {
                      if (isSelected) {
                        const newSelected = statusFilters.filter(
                          (v) => v !== value,
                        );
                        statusColumn?.setFilterValue(
                          newSelected.length ? newSelected : undefined,
                        );
                      } else {
                        statusColumn?.setFilterValue([...statusFilters, value]);
                      }
                    }}
                  >
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
              <CommandItem
                onSelect={() => statusColumn?.setFilterValue(undefined)}
              >
                フィルターを解除する
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
