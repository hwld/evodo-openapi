import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Route, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { tasksRoute } from "../page";
import { EditableTaskDescription } from "./-editable-task-description/editable-task-description";
import { taskQueryOptions, useTask } from "../-hooks/use-task";
import { TaskMemoForm } from "./task-memo-form";
import { taskMemosQueryOptions, useTaskMemos } from "../-hooks/use-task-memos";
import { TaskMemoCard } from "./task-memo-card";
import { Spinner } from "@/components/ui/spinner";
import { ErrorPage } from "@/app/error";

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
  const { taskMemos } = useTaskMemos({ taskId });

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
        <p className="text-muted-foreground text-xs">TASK DETAIL</p>
        <p className="font-bold text-xl mt-1">{task.title}</p>
        <div className="flex flex-col py-8 gap-6">
          <EditableTaskDescription task={task} />
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">コメント</p>
              <Separator />
            </div>
            <div className="space-y-1">
              {taskMemos.map((memo) => {
                return <TaskMemoCard memo={memo} key={memo.id} />;
              })}
            </div>
            <TaskMemoForm taskId={task.id} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
