export const LoginPage: React.FC = () => {
  return (
    <div>
      <a
        href={`${import.meta.env.VITE_API_URL}/login/google`}
        className="bg-gray-900 text-gray-200 py-1 px-3 rounded block w-fit"
      >
        ログイン
      </a>
    </div>
  );
};
