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
import {
  CheckIcon,
  CircleDashedIcon,
  CircleDotIcon,
  PlusCircleIcon,
} from "lucide-react";

export const TaskTableFilter: React.FC = () => {
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
              <CommandItem>
                <div
                  className={cn(
                    "h-4 w-4 border border-foreground rounded mr-3 flex justify-center items-center",
                    true
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible",
                  )}
                >
                  <CheckIcon size={14} />
                </div>
                <div className="flex gap-1 items-center text-foreground/80">
                  <CircleDotIcon size={15} />
                  <span>完了</span>
                </div>
              </CommandItem>
              <CommandItem>
                <div
                  className={cn(
                    "h-4 w-4 border border-foreground rounded mr-3 flex justify-center items-center",
                    false
                      ? "bg-primary text-primary-foreground"
                      : "[&_svg]:invisible",
                  )}
                >
                  <CheckIcon size={14} />
                </div>
                <div className="flex items-center gap-1 text-foreground/80">
                  <CircleDashedIcon size={15} />
                  <span>未完了</span>
                </div>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem>フィルターを解除する</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
