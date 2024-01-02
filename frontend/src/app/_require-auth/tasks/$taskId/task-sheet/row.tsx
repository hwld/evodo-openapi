import { LucideIcon } from "lucide-react";

type Props = { icon: LucideIcon; label: string; value: string };
export const TaskSheetRow: React.FC<Props> = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-center text-sm">
      <div className="w-[100px] text-muted-foreground flex items-center gap-1">
        <Icon size={18} />
        <p className="text-xs">{label}</p>
      </div>
      <div>{value}</div>
    </div>
  );
};
