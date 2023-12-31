import { z } from "zod";
import { schemas } from "../../../api/schema";
import { Sidebar } from "../-sidebar/sidebar";
import { Card } from "@/components/ui/card";
import { HomeIcon } from "lucide-react";
import { Outlet, Route } from "@tanstack/react-router";
import { TaskTable } from "./-task-table/task-table";
import { requireAuthRoute } from "../page";
import { useTaskPage } from "./-hooks/use-task-page";
import { TaskForm } from "./task-form";

const taskSearchParamsSchema = z.object({
  status_filter: schemas["status_filter_"]
    .transform((v) => {
      if (typeof v === "string") {
        return [v];
      }
      return v;
    })
    .default([])
    .catch([]),
  sort: schemas.TaskSort.catch("createdAt"),
  order: schemas.TaskSortOrder.catch("desc"),
  page: z.coerce.number().catch(1),
});
export type TaskSearchParams = z.infer<typeof taskSearchParamsSchema>;
export const defaultTaskSearchParams: TaskSearchParams = {
  status_filter: [],
  sort: "createdAt",
  order: "desc",
  page: 1,
};

export const tasksRoute = new Route({
  getParentRoute: () => requireAuthRoute,
  path: "tasks",
  component: TasksPage,
  validateSearch: taskSearchParamsSchema,
});

export function TasksPage() {
  const { session } = tasksRoute.useRouteContext();
  const { taskPageEntry } = useTaskPage();

  return (
    <div className="min-h-min flex">
      <div className="sticky top-0 px-3 py-5 h-[100dvh]">
        <Sidebar session={session} />
      </div>
      <main className="grow space-y-4 flex flex-col p-5">
        <div className="flex gap-1 items-center">
          <HomeIcon size={18} />
          <p className="text-sm">今日のタスク</p>
        </div>
        <Card className="p-6 grow flex flex-col gap-6">
          <TaskForm />
          {/* TODO */}
          {taskPageEntry && (
            <div className="grow">
              <TaskTable taskPageEntry={taskPageEntry} />
            </div>
          )}
        </Card>
      </main>
      <Outlet />
    </div>
  );
}
