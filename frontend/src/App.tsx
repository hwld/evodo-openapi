import { useQuery } from "@tanstack/react-query";

function App() {
  const { data } = useQuery({
    queryKey: ["text"],
    queryFn: async () => {
      const data = await fetch(import.meta.env.VITE_API_URL);
      return data.text();
    },
  });

  return <div className="h-[100dvh] bg-gray-200 text-gray-700 p-5">{data}</div>;
}

export default App;
