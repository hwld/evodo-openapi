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
import { Pagination } from "@/components/ui/pagination";
import { z } from "zod";
import { schemas } from "@/api/schema";
import { useNavigate } from "@tanstack/react-router";

type Props = {
  taskPageEntry: z.infer<typeof schemas.TaskPageEntry>;
  taskSearchParams: TaskSearchParams;
};
export const TaskTable: React.FC<Props> = ({
  taskPageEntry,
  taskSearchParams,
}) => {
  const table = useReactTable({
    data: taskPageEntry.tasks,
    columns: taskTableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const navigate = useNavigate();

  const currentPage = taskSearchParams.page;
  const handleChangePage = (page: number) => {
    navigate({ search: { ...taskSearchParams, page } });
  };

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
                    {currentPage} of {taskPageEntry.totalPages}
                  </p>
                  <Pagination
                    currentPage={currentPage}
                    onChangePage={handleChangePage}
                    totalPages={taskPageEntry.totalPages}
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
