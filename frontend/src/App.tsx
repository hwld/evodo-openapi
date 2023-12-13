import { useQuery } from "@tanstack/react-query";

function App() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const data = await fetch(`${import.meta.env.VITE_API_URL}/users`);
      return data.json();
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
      {data.map((user: { id: string }) => {
        return <div key={user.id}>{JSON.stringify(user)}</div>;
      })}
    </div>
  );
}

export default App;
