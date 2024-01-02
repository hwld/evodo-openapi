import { AppLogo } from "@/components/ui/app-logo";
import { useTimer } from "@/lib/use-timer";

export const LoadingPage: React.FC = () => {
  const isVisible = useTimer(500);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="flex flex-col justify-center items-center h-full grow">
      <AppLogo
        size={75}
        className="animate-in repeat-infinite spin-in-360 duration-2s ease-linear"
      />
    </div>
  );
};
