import { Tooltip } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { PanelRightIcon, TrashIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { tasksRoute } from "../../../../app/_require-auth/tasks/page";
import { createTaskColumn } from ".";
import { useDeleteTask } from "../../use-delete-task";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export const TaskActionColumn = createTaskColumn.display({
  id: "action",
  size: 0,
  minSize: 0,
  cell: function Cell({ row }) {
    const search = tasksRoute.useSearch();
    const deleteMutation = useDeleteTask();

    const handleDeleteTask = () => {
      deleteMutation.mutate(
        { taskId: row.original.id },
        {
          onSuccess: () => {
            toast.success("タスクを削除しました。");
          },
        },
      );
    };

    return (
      <div className="flex gap-2 items-center">
        <Tooltip label="タスクの詳細を表示する">
          <Button size="icon" variant="outline" asChild>
            <Link
              search={search}
              to="/tasks/$taskId"
              params={{ taskId: row.original.id }}
            >
              <PanelRightIcon size={16} />
            </Link>
          </Button>
        </Tooltip>
        <AlertDialog>
          <Tooltip label="タスクを削除する">
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                disabled={deleteMutation.isPending}
              >
                <TrashIcon size={16} />
              </Button>
            </AlertDialogTrigger>
          </Tooltip>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>タスクの削除</AlertDialogTitle>
              <AlertDialogDescription>
                タスク: `
                <span className="text-primary">{row.original.title}</span>`
                を削除しますか？
                <br />
                タスクを削除すると、元に戻すことはできません。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteTask}
                disabled={deleteMutation.isPending}
              >
                削除する
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  },
});
