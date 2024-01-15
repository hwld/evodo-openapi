import { Separator } from "@/components/ui/separator";
import { SheetContent } from "@/components/ui/sheet";
import { EditableTaskDescription } from "../editable-task-description/editable-task-description";
import { TaskMemoForm } from "../../task-memo/task-memo-form";
import { useTaskMemos } from "../../task-memo/use-task-memos";
import { TaskMemoCard } from "../../task-memo/task-memo-card";
import { TaskStatusBadge } from "../task-status-badge";
import { useUpdateTask } from "../use-update-task";
import { Task } from "@/api/types";
import { TaskSheetRow } from "./row";
import { dateColumnOptions } from "../task-table/columns/date-column";
import { TaskPriorityBadge } from "../task-priority-badge";
import { ArrowUpDownIcon } from "lucide-react";

type Props = { task: Task };
export const TaskSheetContent: React.FC<Props> = ({ task }) => {
  const { taskMemos } = useTaskMemos({ taskId: task.id });

  const updateStatusMutation = useUpdateTask();
  const handleUpdateTaskStatus = () => {
    updateStatusMutation.mutate({
      ...task,
      taskId: task.id,
      status: task.status === "done" ? "todo" : "done",
    });
  };

  const updatePriorityMutation = useUpdateTask();
  const handleUpdateTaskPriority = (value: Task["priority"]) => {
    updatePriorityMutation.mutate({
      ...task,
      taskId: task.id,
      priority: value,
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
        <TaskStatusBadge
          status={task.status}
          onClick={handleUpdateTaskStatus}
          disabled={updateStatusMutation.isPending}
        />
        <div className="space-y-2">
          <TaskSheetRow
            icon={ArrowUpDownIcon}
            label="優先度"
            value={
              <TaskPriorityBadge
                size="md"
                priority={task.priority}
                onPriorityChange={handleUpdateTaskPriority}
                disabled={updatePriorityMutation.isPending}
              />
            }
          />
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
