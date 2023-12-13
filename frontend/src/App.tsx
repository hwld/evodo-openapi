import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { schemas } from "./api/schema";
import { z } from "zod";
import { api } from "./api";

function App() {
  const client = useQueryClient();
  const [username, setUserName] = useState("");

  const {
    data: uesrs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return await api.get("/users");
    },
  });

  const { mutate } = useMutation({
    mutationFn: (newUser: z.infer<typeof schemas.CreateUserInput>) => {
      return api.post("/users", newUser);
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
    <div className="h-[100dvh] bg-gray-200 text-gray-700 p-5">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await mutate({ name: username });
          setUserName("");
        }}
      >
        <input
          placeholder="ユーザー名"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
        />
      </form>
      {uesrs?.map((user) => {
        return (
          <div key={user.id} className="m-1">
            <p>{user.name}</p>
          </div>
        );
      })}
    </div>
  );
}

export default App;
