import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { XIcon } from "lucide-react";
import { TaskTableStatusFilter } from "./status-filter";
import { Button } from "@/components/ui/button";
import { doneColumnOptions } from "./columns";
import { useNavigate } from "@tanstack/react-router";
import { TaskSearchParams } from "@/routes";

type Props = { taskSearchParams: TaskSearchParams };
export const TaskTableToolbar: React.FC<Props> = ({ taskSearchParams }) => {
  const navigate = useNavigate();

  const statusFilters = taskSearchParams.status_filter;

  return (
    <div className="flex items-center gap-5 h-7">
      <TaskTableStatusFilter taskSearchParams={taskSearchParams} />
      <Separator orientation="vertical" />
      <div className="flex items-center gap-2">
        {statusFilters.map((filter) => {
          const option = doneColumnOptions.filter(
            ({ value }) => value === filter,
          )[0];

          const clearFilter = () => {
            const newFilters = statusFilters.filter((f) => f !== filter);
            navigate({
              search: {
                status_filter: newFilters.length ? newFilters : undefined,
              },
            });
          };

          return (
            <Badge variant="secondary" size="sm" key={String(filter)}>
              {option.label}
              <Button size="iconXs" variant="ghost" onClick={clearFilter}>
                <XIcon size={15} />
              </Button>
            </Badge>
          );
        })}
      </div>
    </div>
  );
};
