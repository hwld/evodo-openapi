import { useGetUsers } from "./api";

function App() {
  const { data: uesrs, isLoading, isError } = useGetUsers();

  if (isError) {
    return <div>error</div>;
  }
  if (isLoading) {
    return <div>loading</div>;
  }

  return (
    <div className="h-[100dvh] bg-gray-200 text-gray-700 p-5">
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
