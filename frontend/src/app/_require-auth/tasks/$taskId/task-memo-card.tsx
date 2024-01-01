import { TaskMemo } from "@/api/types";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { useDeleteTaskMemo } from "../-hooks/use-delete-task-memo";
import { Tooltip } from "@/components/ui/tooltip";

type Props = { memo: TaskMemo };
export const TaskMemoCard: React.FC<Props> = ({ memo }) => {
  const deleteTaskMemoMutation = useDeleteTaskMemo();

  const handleDeleteTaskMemo = () => {
    deleteTaskMemoMutation.mutate({ taskId: memo.taskId, taskMemoId: memo.id });
  };

  return (
    <div
      key={memo.id}
      className="flex justify-between p-2 border border-border items-center rounded"
    >
      <div className="flex gap-2">
        <div className="h-8 w-8 bg-accent rounded-full" />
        <p className="text-sm"> {memo.content}</p>
      </div>
      <Tooltip label="メモを削除する">
        <Button size="icon" variant="outline" onClick={handleDeleteTaskMemo}>
          <TrashIcon size={16} />
        </Button>
      </Tooltip>
    </div>
  );
};
