import { useState } from "react";
import { useGetUsers, usePostUsers } from "./api";
import { useQueryClient } from "@tanstack/react-query";

function App() {
  const client = useQueryClient();
  const [username, setUserName] = useState("");
  const { data: uesrs, isLoading, isError } = useGetUsers();
  const { mutate } = usePostUsers({
    mutation: {
      onSuccess: () => {
        client.invalidateQueries();
      },
      onError: () => {
        window.alert("error");
      },
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
          await mutate({ data: { name: username } });
          setUserName("");
        }}
      >
        <input
          placeholder="ユーザー名"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
        />
      </form>
      {uesrs?.data.map((user) => {
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
