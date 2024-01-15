import { schemas } from "@/api/schema";
import { Task } from "@/api/types";
import { Button } from "@/components/ui/button";
import { useMergedRef } from "@mantine/hooks";
import { cn, stopPropagation } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useLayoutEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUpdateTask } from "../use-update-task";

export const taskDescriptionTextareaClass =
  "w-full border border-border rounded p-3 text-sm bg-transparent min-h-[200px] focus-visible:outline-none focus-visible:ring-1  resize-none overflow-hidden focus-visible:ring-ring";

const taskDescriptionSchema = schemas.UpdateTaskInput.pick({
  description: true,
});
type TaskDescriptionForm = z.infer<typeof taskDescriptionSchema>;

type Props = {
  task: Task;
  defualtHeight: number;
  onAfterSuccess?: () => void;
  onAfterCancel?: () => void;
};
export const TaskDescriptionForm = forwardRef<HTMLTextAreaElement, Props>(
  function ({ task, onAfterSuccess, defualtHeight, onAfterCancel }, ref) {
    const taskUpdateMutation = useUpdateTask();

    const {
      register,
      handleSubmit: createHandleSubmit,
      formState: { errors },
    } = useForm<TaskDescriptionForm>({
      defaultValues: { description: task.description },
      resolver: zodResolver(taskDescriptionSchema),
    });

    const _textArearef = useRef<HTMLTextAreaElement>(null);
    const { ref: _ref, onChange, ...otherRegister } = register("description");
    const textArearef = useMergedRef(_ref, ref, _textArearef);

    const handleSubmit = createHandleSubmit(({ description }) => {
      taskUpdateMutation.mutate(
        { ...task, taskId: task.id, description },
        {
          onSuccess: () => {
            onAfterSuccess?.();
          },
        },
      );
    });

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      // 行数が減ったときに1行分縮むようにする
      e.target.style.height = "auto";
      e.target.style.height = `${e.target.scrollHeight}px`;
      onChange(e);
    };

    useLayoutEffect(() => {
      if (_textArearef.current) {
        _textArearef.current.style.height = `${defualtHeight}px`;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div>
        <textarea
          onKeyDown={stopPropagation}
          className={cn(
            taskDescriptionTextareaClass,
            errors.description && "focus-visible:ring-destructive",
          )}
          ref={textArearef}
          onChange={handleChange}
          {...otherRegister}
        />
        <div className="mt-1 flex justify-between">
          <p className="text-destructive text-sm">
            {errors.description?.message}
          </p>
          <div className="flex gap-1 items-center">
            <Button size="xs" variant="outline" onClick={onAfterCancel}>
              キャンセル
            </Button>
            <Button size="xs" onClick={handleSubmit}>
              更新
            </Button>
          </div>
        </div>
      </div>
    );
  },
);
