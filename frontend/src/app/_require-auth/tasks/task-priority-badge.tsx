import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Task } from "@/api/types";
import { priorityColumnOptions } from "./-task-table/-columns/priority-column";

type Props = {
  priority: Task["priority"];
  onPriorityChange: (value: Task["priority"]) => void;
  disabled?: boolean;
  size?: "md" | "sm";
};
export const TaskPriorityBadge: React.FC<Props> = ({
  priority,
  disabled,
  onPriorityChange,
  size = "md",
}) => {
  const sizeMap = {
    md: { buttonSize: "sm", iconSize: 20 },
    sm: { buttonSize: "xs", iconSize: 15 },
  } as const;

  const { label, icon: Icon } = priorityColumnOptions.find(
    (opt) => opt.value === priority,
  )!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size={sizeMap[size].buttonSize}
          variant="ghost"
          disabled={disabled}
          className="gap-1"
        >
          {label}
          <Icon size={sizeMap[size].iconSize} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start">
        {priorityColumnOptions.map(({ label, icon: Icon, value }) => {
          return (
            <DropdownMenuItem
              className={cn(priority === value && "pointer-events-none")}
              onClick={() => onPriorityChange(value)}
              disabled={disabled}
            >
              <div className="flex gap-1 items-center justify-between w-full">
                <div className="flex items-center gap-1">
                  <p>{label}</p>
                  <Icon size={15} />
                </div>
                {priority === value && <CheckIcon size={15} />}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
