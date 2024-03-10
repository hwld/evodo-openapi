import { schemas } from "@/api/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateTask } from "./use-create-task";
import { useEffect, useRef } from "react";
import { useMergedRef } from "@mantine/hooks";
import { CommandIcon, SendHorizonalIcon } from "lucide-react";

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

  const { onBlur, ref, ...otherRegister } = register("title");
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur(e);
    reset();
  };

  const _inputRef = useRef<HTMLInputElement>(null);
  const inputRef = useMergedRef(ref, _inputRef);
  useEffect(() => {
    const focusInput = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k" && _inputRef.current) {
        _inputRef.current.focus();
      }
    };

    window.addEventListener("keydown", focusInput);
    return () => window.removeEventListener("keydown", focusInput);
  }, []);

  return (
    <form
      onSubmit={handleCreateTask}
      className="flex gap-2 items-center relative"
    >
      <div className="flex items-center border border-muted-foreground p-2 rounded-md text-sm gap-2 focus-within:ring-2 ring-offset-2 ring-ring ring-offset-background">
        <div className="flex items-center gap-0.5 text-xs border px-[6px] py-[2px] rounded-md text-muted-foreground border-muted-foreground">
          <CommandIcon size={12} />K
        </div>
        <input
          ref={inputRef}
          placeholder="タスクを入力してください..."
          {...otherRegister}
          onBlur={handleBlur}
          className="w-[600px] bg-transparent placeholder:text-sm placeholder:text-muted-foreground focus-visible:outline-none"
        />
        <SendHorizonalIcon size={15} className="text-muted-foreground" />
      </div>
      {errors.title && (
        <div className="absolute top-[130%] bg-background border border-border rounded px-3 py-2 text-sm text-destructive shadow-2xl animate-in fade-in slide-in-from-top-1">
          {errors.title.message}
        </div>
      )}
    </form>
  );
};
