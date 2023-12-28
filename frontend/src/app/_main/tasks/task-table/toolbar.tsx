import { Task } from "@/api/types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table } from "@tanstack/react-table";
import { XIcon } from "lucide-react";
import { TaskTableFilterButton } from "./filter-button";
import { Button } from "@/components/ui/button";

type Props = { table: Table<Task> };
export const TaskTableToolbar: React.FC<Props> = () => {
  return (
    <div className="flex items-center gap-5 h-7">
      <TaskTableFilterButton />

      <Separator orientation="vertical" />

      <div className="flex items-center gap-2">
        <Badge variant="secondary" size="sm">
          完了
          <Button size="iconXs" variant="ghost">
            <XIcon size={15} />
          </Button>
        </Badge>
        <Badge variant="secondary" size="sm">
          未完了
          <Button size="iconXs" variant="ghost">
            <XIcon size={15} />
          </Button>
        </Badge>
      </div>
    </div>
  );
};
