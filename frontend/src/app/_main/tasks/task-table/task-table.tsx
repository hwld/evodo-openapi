import { Task } from "@/api/types";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { taskTableColumns } from "./columns";
import { TaskTableToolbar } from "./toolbar";
import { TaskSearchParams } from "@/routes";
import { useState } from "react";
import { Pagination } from "@/components/ui/pagination";

type Props = {
  tasks: Task[];
  taskSearchParams: TaskSearchParams;
};
export const TaskTable: React.FC<Props> = ({ tasks, taskSearchParams }) => {
  const table = useReactTable({
    data: tasks,
    columns: taskTableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const [currentPage, setCurrentPage] = useState(5);
  const totalPages = 20;

  return (
    <div className="flex flex-col gap-3">
      <TaskTableToolbar taskSearchParams={taskSearchParams} />
      <div className="rounded border flex w-full overflow-auto">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="relative">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow key={row.id}>
                    {row.getAllCells().map((cell) => {
                      return (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow className="pointer-events-none select-none">
                <TableCell colSpan={5}>
                  <div className="flex flex-col justify-center items-center h-[300px]">
                    <p className="text-sm text-muted">タスクが存在しません。</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5} className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm">
                    {currentPage} of {totalPages}
                  </p>
                  <Pagination
                    currentPage={currentPage}
                    onChangePage={setCurrentPage}
                    totalPages={totalPages}
                  />
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};
