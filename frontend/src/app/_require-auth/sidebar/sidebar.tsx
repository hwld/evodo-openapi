import { AppLogo } from "@/components/ui/app-logo";
import {
  CalendarIcon,
  HomeIcon,
  LayoutListIcon,
  LogOutIcon,
  UserIcon,
} from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { Button } from "@/components/ui/button";
import { api } from "@/api";
import { useRouter } from "@tanstack/react-router";
import { Session } from "@/api/types";

type Props = { session: Session };
export const Sidebar: React.FC<Props> = ({ session }) => {
  const route = useRouter();

  const handleLogout = async () => {
    await api.post("/logout", undefined);
    route.invalidate();
  };

  return (
    <div className="w-[250px] h-full flex flex-col justify-between">
      <div className="flex flex-col gap-7">
        <div className="flex gap-1 items-center px-3">
          <AppLogo size={20} />
          <p className="mb-1">evodo-openapi</p>
        </div>
        <ul className="flex flex-col gap-1">
          <SidebarItem active icon={HomeIcon}>
            今日のタスク
          </SidebarItem>
          <SidebarItem icon={LayoutListIcon}>過去のタスク</SidebarItem>
          <SidebarItem icon={CalendarIcon}>予定</SidebarItem>
        </ul>
      </div>
      <div className="p-3 flex rounded items-center justify-between border-border border">
        <div className="flex gap-2 items-center">
          <UserIcon className="bg-background/20 h-[25px] w-[25px] rounded-full border border-foreground" />
          <div className="text-sm">{session.user.name}</div>
        </div>
        <Button size="icon" variant="ghost" onClick={handleLogout}>
          <LogOutIcon size={18} />
        </Button>
      </div>
    </div>
  );
};
