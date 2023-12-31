import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Route, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { tasksRoute } from "../page";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { EditableTaskDescription } from "./editable-task-description/editable-task-description";

export const taskDetailRoute = new Route({
  getParentRoute: () => tasksRoute,
  path: "$taskId",
  component: TaskDetailPage,
});

export function TaskDetailPage() {
  const { taskId } = taskDetailRoute.useParams();
  const { data: task } = useQuery({
    queryKey: ["tasks", taskId],
    queryFn: async () => {
      return await api.get("/tasks/:id", { params: { id: taskId } });
    },
  });

  const search = taskDetailRoute.useSearch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const handleCloseSheet = () => {
    // closeアニメーションを待つ
    setTimeout(() => {
      navigate({ to: "/tasks", search });
    }, 300);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setOpen(false);
          handleCloseSheet();
        }
      }}
    >
      <SheetContent>
        <p className="text-muted text-xs">TASK DETAIL</p>
        {/* TODO */}
        {task && (
          <>
            <p className="font-bold text-xl mt-1">{task.title}</p>
            <div className="flex flex-col py-8 gap-6">
              <EditableTaskDescription task={task} />
              <div className="space-y-2">
                <p className="text-muted text-sm">コメント</p>
                <Separator />
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
