import { schemas } from "@/api/schema";
import { Task } from "@/api/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUpdateTask } from "../../-hooks/use-update-task";
import { RefObject } from "react";
import { useMergedRef } from "@mantine/hooks";
import { cn } from "@/lib/utils";

const taskTitleFormSchema = schemas.UpdateTaskInput.pick({ title: true });
type TaskTitleForm = z.infer<typeof taskTitleFormSchema>;

type Props = {
  task: Task;
  onAfterSuccess?: () => void;
  onCancel?: () => void;
  inputRef?: RefObject<HTMLInputElement>;
};
export const TaskTitleForm: React.FC<Props> = ({
  task,
  onAfterSuccess,
  onCancel,
  inputRef,
}) => {
  const updateTaskMutation = useUpdateTask();
  const {
    register,
    handleSubmit: createSubmitHandler,
    formState: { errors },
  } = useForm<TaskTitleForm>({
    defaultValues: { title: task.title },
    resolver: zodResolver(taskTitleFormSchema),
  });

  const { onBlur, ref: _ref, ...otherRegister } = register("title");
  const ref = useMergedRef(_ref, inputRef);

  const handleUpdateTaskTitle = createSubmitHandler(async ({ title }) => {
    updateTaskMutation.mutate(
      { ...task, title, taskId: task.id },
      {
        onSuccess: () => {
          onAfterSuccess?.();
        },
      },
    );
  });

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur(e);
    onCancel?.();
  };

  return (
    <form onSubmit={handleUpdateTaskTitle} className="relative">
      <input
        ref={ref}
        onBlur={handleBlur}
        {...otherRegister}
        className={cn(
          "w-full bg-transparent rounded p-1 focus-visible:outline-none ring-ring focus-visible:ring-1",
          errors.title && "ring-destructive",
        )}
      />
      {errors.title && (
        <div className="absolute top-[120%] px-3 py-1 text-destructive bg-background text-xs shadow-2xl rounded border border-border animate-in slide-in-from-top-1">
          {errors.title.message}
        </div>
      )}
    </form>
  );
};
