import { cx } from "class-variance-authority";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

type Props = { children: ReactNode; icon: LucideIcon; active?: boolean };

export const SidebarItem: React.FC<Props> = ({
  children,
  icon: Icon,
  active,
}) => {
  return (
    <button
      className={cx(
        "py-2 px-3 rounded flex gap-1 transition-colors select-none cursor-pointer items-center",
        active
          ? "bg-foreground/20 pointer-events-none"
          : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
      )}
    >
      <Icon size={18} />
      <p className="text-sm">{children}</p>
    </button>
  );
};
