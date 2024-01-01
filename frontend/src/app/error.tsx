export const ErrorPage = () => {
  return (
    <div className="h-full w-full flex justify-center items-center flex-col gap-4">
      <div className="flex flex-col items-center gap-1">
        <h1 className="text-xl font-bold">Error</h1>
        <p className="text-sm text-muted-foreground text-center">
          予期せぬエラーが発生しました。
          <br />
          更新してもエラーが消えない場合は、時間をおいてアクセスしてください。
        </p>
      </div>
    </div>
  );
};
