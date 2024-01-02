import { Separator } from "@/components/ui/separator";
import { SheetContent } from "@/components/ui/sheet";
import { EditableTaskDescription } from "../-editable-task-description/editable-task-description";
import { TaskMemoForm } from "../task-memo-form";
import { useTaskMemos } from "../../-hooks/use-task-memos";
import { TaskMemoCard } from "../task-memo-card";
import { StatusBadge } from "../../task-status-badge";
import { useUpdateTask } from "../../-hooks/use-update-task";
import { Task } from "@/api/types";
import { TaskSheetRow } from "./row";
import { dateColumnOptions } from "../../-task-table/-columns/date-column";

type Props = { task: Task };
export const TaskSheetContent: React.FC<Props> = ({ task }) => {
  const { taskMemos } = useTaskMemos({ taskId: task.id });

  const updateMutation = useUpdateTask();
  const handleUpdateTaskStatus = () => {
    updateMutation.mutate({
      ...task,
      status: task.status === "done" ? "todo" : "done",
      taskId: task.id,
    });
  };

  const createdAtOptions = dateColumnOptions["createdAt"];
  const updatedAtOptions = dateColumnOptions["updatedAt"];

  return (
    <SheetContent>
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs">TASK DETAIL</p>
          <p className="font-bold text-xl">{task.title}</p>
        </div>
        <StatusBadge status={task.status} onClick={handleUpdateTaskStatus} />
        <div className="space-y-2">
          <TaskSheetRow
            icon={createdAtOptions.icon}
            label={createdAtOptions.label}
            value={task.createdAt}
          />
          <TaskSheetRow
            icon={updatedAtOptions.icon}
            label={updatedAtOptions.label}
            value={task.updatedAt}
          />
        </div>
        <EditableTaskDescription task={task} />
        <div className="space-y-3">
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
  );
};
