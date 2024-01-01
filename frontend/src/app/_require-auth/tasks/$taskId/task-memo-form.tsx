import { schemas } from "@/api/schema";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizonalIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateTaskMemo } from "../-hooks/use-create-task-memo";

const taskMemoFormSchema = schemas.CreateTaskMemoInput;
type TaskMemoFormData = z.infer<typeof taskMemoFormSchema>;

type Props = { taskId: string };
export const TaskMemoForm: React.FC<Props> = ({ taskId }) => {
  const {
    register,
    handleSubmit: createSubmitHandler,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<TaskMemoFormData>({
    defaultValues: { content: "" },
    resolver: zodResolver(taskMemoFormSchema),
  });

  const { onBlur, ...otherRegister } = register("content");
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur(e);
    clearErrors();
  };

  const createTaskMemoMutation = useCreateTaskMemo();
  const handleCreateTaskMemo = createSubmitHandler(({ content }) => {
    createTaskMemoMutation.mutate(
      { content, taskId },
      {
        onSuccess: () => {
          reset();
        },
      },
    );
  });

  return (
    <div>
      <form
        className="w-full flex gap-2 items-center"
        onSubmit={handleCreateTaskMemo}
      >
        <Input
          size="sm"
          placeholder="メモを入力してください..."
          autoComplete="off"
          error={!!errors.content}
          onBlur={handleBlur}
          {...otherRegister}
        />
        <SendHorizonalIcon size={20} className="text-muted-foreground" />
      </form>
      {errors.content && (
        <p className="text-sm text-destructive mt-1 ml-1">
          {errors.content.message}
        </p>
      )}
    </div>
  );
};
