import { createTaskColumn } from ".";
import { useRef, useState } from "react";
import { TaskTitleForm } from "./task-title-form";
import { Tooltip } from "@/components/ui/tooltip";

export const taskTitleColumn = createTaskColumn.accessor("title", {
  header: "タスク",
  cell: function Cell({ getValue, row }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [editable, setEditable] = useState(false);

    const handleDisableEditing = () => {
      setEditable(false);
    };

    const handleEnableEditing = () => {
      setEditable(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    };

    return editable ? (
      <TaskTitleForm
        task={row.original}
        onAfterSuccess={handleDisableEditing}
        onCancel={handleDisableEditing}
        inputRef={inputRef}
      />
    ) : (
      <Tooltip label="タイトルを編集する">
        <button
          className="inline focus-visible:outline-none focus-visible:ring-1 ring-ring p-1 rounded hover:bg-accent transition-colors"
          onClick={handleEnableEditing}
        >
          {getValue()}
        </button>
      </Tooltip>
    );
  },
});
