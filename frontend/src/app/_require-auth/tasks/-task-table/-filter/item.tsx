import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CheckIcon, LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  label: string;
  isSelected: boolean;
  onSelect: () => void;
};
export const TaskTableFilterItem: React.FC<Props> = ({
  isSelected,
  icon: Icon,
  label,
  onSelect,
}) => {
  const handleSelect = (e: Event) => {
    e.preventDefault();
    onSelect();
  };

  return (
    <DropdownMenuItem onSelect={handleSelect}>
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
    </DropdownMenuItem>
  );
};
