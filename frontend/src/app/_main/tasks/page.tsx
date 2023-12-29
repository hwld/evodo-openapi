import { useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { z } from "zod";
import { api } from "../../../api";
import { schemas } from "../../../api/schema";
import { Sidebar } from "../sidebar/sidebar";
import { Card } from "@/components/ui/card";
import { HomeIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouteContext, useSearch } from "@tanstack/react-router";
import { TaskTable } from "./task-table/task-table";

function TasksPage() {
  const { session } = useRouteContext({ from: "/requireAuth/" as const });

  const client = useQueryClient();
  const [title, setTitle] = useState("");

  const taskSearchParams = useSearch({ from: "/requireAuth/" as const });
  const { data: tasks } = useQuery({
    queryKey: ["tasks", { statusFilter: taskSearchParams.status_filter }],
    queryFn: async () => {
      return await api.get("/tasks", {
        queries: {
          "status_filter[]": taskSearchParams.status_filter,
        },
      });
    },
    placeholderData: keepPreviousData,
  });

  const { mutate } = useMutation({
    mutationFn: (newTask: z.infer<typeof schemas.CreateTaskInput>) => {
      return api.post("/tasks", newTask);
    },
    onSuccess: () => {
      client.invalidateQueries();
    },
    onError: () => {
      window.alert("error");
    },
  });

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
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              mutate({ title, description: "" });
              setTitle("");
            }}
          >
            <Input
              size="sm"
              placeholder="タスクを入力してください..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </form>
          {/* TODO */}
          {tasks && (
            <div className="grow">
              <TaskTable tasks={tasks} taskSearchParams={taskSearchParams} />
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}

export default TasksPage;
