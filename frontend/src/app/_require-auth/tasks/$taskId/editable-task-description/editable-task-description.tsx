import { Task } from "@/api/types";
import { useRef, useState } from "react";
import {
  TaskDescriptionForm,
  taskDescriptionTextareaClass,
} from "./task-description-form";

type Props = { task: Task };
export const EditableTaskDescription: React.FC<Props> = ({ task }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [editable, setEditable] = useState(false);

  const handleEnableEditing = () => {
    setEditable(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const handleDisableEditing = () => {
    setEditable(false);
  };

  return editable ? (
    <TaskDescriptionForm
      ref={textareaRef}
      task={task}
      onSuccess={handleDisableEditing}
      // refの値をpropsに渡しているが、読み取り専用なので問題ないはず・・・
      defualtHeight={textRef.current?.clientHeight ?? 0}
    />
  ) : (
    <div
      ref={textRef}
      className={taskDescriptionTextareaClass}
      onClick={handleEnableEditing}
    >
      {task.description ? (
        <p className="whitespace-pre-wrap">{task.description}</p>
      ) : (
        <p className="text-muted select-none">
          クリックしてタスクの説明を入力してください...
        </p>
      )}
    </div>
  );
};
