import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { schemas } from "./api/schema";
import { z } from "zod";
import { api } from "./api";
import { Link } from "@tanstack/react-router";

function App() {
  const client = useQueryClient();
  const [title, setTitle] = useState("");

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      return await api.get("/session");
    },
  });

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

  const handleLogout = async () => {
    await api.post("/logout", undefined);
    client.invalidateQueries();
  };

  if (isError) {
    return <div>error</div>;
  }
  if (isLoading) {
    return <div>loading</div>;
  }

  return (
    <div>
      <Link to="/auth/signup">新規登録</Link>
      <div className="flex">
        {session ? (
          <>
            <p>{session.user.name}</p>
            <a
              onClick={handleLogout}
              className="bg-gray-900 text-gray-200 py-1 px-3 rounded block w-fit"
            >
              ログアウト
            </a>
          </>
        ) : (
          <a
            href={`${import.meta.env.VITE_API_URL}/login/google`}
            className="bg-gray-900 text-gray-200 py-1 px-3 rounded block w-fit"
          >
            ログイン
          </a>
        )}
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await mutate({ title, description: "" });
          setTitle("");
        }}
      >
        <input
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
    </div>
  );
}

export default App;
