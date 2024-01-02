import { AppLogo } from "@/components/ui/app-logo";

export const LoadingPage: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full grow">
      <AppLogo
        size={75}
        className="animate-in repeat-infinite spin-in-360 duration-2s ease-linear"
      />
    </div>
  );
};
