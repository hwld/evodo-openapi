import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Route, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { tasksRoute } from "../page";

export const taskDetailRoute = new Route({
  getParentRoute: () => tasksRoute,
  path: "$taskId",
  component: TaskDetailPage,
});

export function TaskDetailPage() {
  const search = taskDetailRoute.useSearch();
  const { taskId } = taskDetailRoute.useParams();
  console.log(taskId);
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
        <p className="font-bold text-xl mt-1">タスクの詳細画面を実装する</p>
        <div className="flex flex-col py-8 gap-6">
          <div className="w-full h-[200px] border border-border rounded" />
          <div className="space-y-2">
            <p className="text-muted text-sm">コメント</p>
            <Separator />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
