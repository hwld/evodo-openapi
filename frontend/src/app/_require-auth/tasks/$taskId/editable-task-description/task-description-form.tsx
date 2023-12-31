import { api } from "@/api";
import { schemas } from "@/api/schema";
import { Task } from "@/api/types";
import { Button } from "@/components/ui/button";
import { useMergedRef } from "@/lib/use-merged-ref";
import { stopPropagation } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { forwardRef, useLayoutEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const taskDescriptionTextareaClass =
  "w-full border border-border rounded p-3 text-sm bg-transparent min-h-[200px] focus-visible:outline-none focus-visible:ring-1  resize-none overflow-hidden focus-visible:ring-ring";

const taskDescriptionSchema = schemas.UpdateTaskInput.pick({
  description: true,
});
type TaskDescriptionForm = z.infer<typeof taskDescriptionSchema>;

type Props = {
  task: Task;
  onSuccess?: () => void;
  defualtHeight: number;
};
export const TaskDescriptionForm = forwardRef<HTMLTextAreaElement, Props>(
  function ({ task, onSuccess, defualtHeight }, ref) {
    const client = useQueryClient();
    const { mutate } = useMutation({
      mutationFn: ({ description }: TaskDescriptionForm) => {
        return api.put(
          "/tasks/:id",
          { ...task, description },
          { params: { id: task.id } },
        );
      },
      onSuccess: () => {
        onSuccess?.();
      },
      onSettled: () => {
        client.invalidateQueries();
      },
    });

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
      mutate({ description });
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
          className={taskDescriptionTextareaClass}
          ref={textArearef}
          onChange={handleChange}
          {...otherRegister}
        />
        <div>
          <div>
            <p>{errors.description?.message}</p>
          </div>
          <div>
            <Button onClick={handleSubmit}>更新</Button>
          </div>
        </div>
      </div>
    );
  },
);
