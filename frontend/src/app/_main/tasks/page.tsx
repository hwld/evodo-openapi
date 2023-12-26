import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { api } from "../../../api";
import { schemas } from "../../../api/schema";
import { Sidebar } from "../sidebar/sidebar";
import { Card } from "@/components/ui/card";
import { HomeIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouteContext } from "@tanstack/react-router";

function TasksPage() {
  const { session } = useRouteContext({ from: "/requireAuth/" as const });

  const client = useQueryClient();
  const [title, setTitle] = useState("");

  const {
    data: tasks,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      return await api.get("/tasks");
    },
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

  if (isError) {
    return <div>error</div>;
  }
  if (isLoading) {
    return <div>loading</div>;
  }

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
        <Card className="p-6 grow">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              mutate({ title, description: "" });
              setTitle("");
            }}
          >
            <Input
              placeholder="タスクを入力してください..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </form>
          {tasks?.map((task) => {
            return (
              <div key={task.id} className="m-1">
                <p>{task.title}</p>
              </div>
            );
          })}
        </Card>
      </main>
    </div>
  );
}

export default TasksPage;
