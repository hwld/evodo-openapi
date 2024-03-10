import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

type Props = {
  type: "status" | "priority";
  label: string;
  onRemove: () => void;
};
export const TaskTableFilterBadge: React.FC<Props> = ({
  type,
  label,
  onRemove,
}) => {
  const prefix = { status: "状態", priority: "優先度" }[type];

  return (
    <Badge variant="secondary" size="sm">
      <span className="text-muted-foreground mr-1">{prefix}:</span>
      {label}
      <Button size="iconXs" variant="ghost" onClick={onRemove}>
        <XIcon size={15} />
      </Button>
    </Badge>
  );
};
