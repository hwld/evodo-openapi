import { schemas } from "@/api/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateTask } from "./-hooks/use-create-task";
import { Input } from "@/components/ui/input";

const taskFormSchema = schemas.CreateTaskInput;
type TaskFormData = z.infer<typeof taskFormSchema>;

export const TaskForm: React.FC = () => {
  const {
    register,
    handleSubmit: createSubmitHandler,
    formState: { errors },
    reset,
  } = useForm<TaskFormData>({
    defaultValues: { title: "" },
    resolver: zodResolver(taskFormSchema),
  });

  const createTaskMutation = useCreateTask();
  const handleCreateTask = createSubmitHandler(async ({ title }) => {
    createTaskMutation.mutate(
      { title },
      {
        onSuccess: () => {
          reset();
        },
      },
    );
  });

  const { onBlur, ...otherRegister } = register("title");
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur(e);
    reset();
  };

  return (
    <form onSubmit={handleCreateTask} className="relative">
      <Input
        size="sm"
        placeholder="タスクを入力してください..."
        {...otherRegister}
        onBlur={handleBlur}
      />
      {errors.title && (
        <div className="absolute top-[130%] bg-background border border-border rounded px-3 py-2 text-sm text-destructive shadow-2xl animate-in fade-in slide-in-from-top-1">
          {errors.title.message}
        </div>
      )}
    </form>
  );
};
