import { Task } from "@/api/types";
import { statusColumnOptions } from "./-task-table/-columns/status-column";
import { Badge } from "@/components/ui/badge";

type Props = {
  status: Task["status"];
  onClick?: () => void;
  size?: "default" | "sm";
};
export const StatusBadge: React.FC<Props> = ({
  status,
  onClick,
  size = "default",
}) => {
  const option = statusColumnOptions.find((opt) => opt.value === status)!;
  const Icon = option.icon;
  const label = option.label;

  const variantMap = { done: "success", todo: "destructive" } as const;

  const iconSizeMap = {
    default: 18,
    sm: 13,
  };

  return (
    <Badge size={size} variant={variantMap[status]} onClick={onClick}>
      <Icon size={iconSizeMap[size]} className="mr-1" />
      {label}
    </Badge>
  );
};
