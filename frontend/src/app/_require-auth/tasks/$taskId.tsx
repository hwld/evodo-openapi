import { Sheet } from "@/components/ui/sheet";
import { Route, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { tasksRoute } from "./page";
import { taskQueryOptions, useTask } from "../../../features/task/use-task";
import { taskMemosQueryOptions } from "../../../features/task-memo/use-task-memos";
import { Spinner } from "@/components/ui/spinner";
import { ErrorPage } from "@/app/error";
import { TaskSheetContent } from "../../../features/task/task-sheet/content";

export const taskDetailRoute = new Route({
  getParentRoute: () => tasksRoute,
  path: "$taskId",
  component: TaskDetailPage,
  loader: ({ params, context: { queryClient } }) => {
    return Promise.all([
      queryClient.ensureQueryData(taskQueryOptions(params.taskId)),
      queryClient.ensureQueryData(taskMemosQueryOptions(params.taskId)),
    ]);
  },
  pendingComponent: function Pending() {
    return (
      <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
        <Spinner />
      </div>
    );
  },
  errorComponent: () => {
    return (
      <div className="fixed inset-0 bg-black/80">
        <ErrorPage />
      </div>
    );
  },
});

export function TaskDetailPage() {
  const { taskId } = taskDetailRoute.useParams();
  const { task } = useTask({ taskId });

  const search = taskDetailRoute.useSearch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setOpen(false);
      // closeアニメーションを待つ
      setTimeout(() => {
        navigate({ to: "/tasks", search });
      }, 300);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <TaskSheetContent task={task} />
    </Sheet>
  );
}
