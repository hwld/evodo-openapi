import { createTaskColumn } from ".";

export const taskTitleColumn = createTaskColumn.accessor("title", {
  header: "タスク",
  cell: ({ getValue }) => {
    return <p>{getValue()}</p>;
  },
});
