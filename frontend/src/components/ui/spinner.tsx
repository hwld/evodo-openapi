import { AppLogo } from "./app-logo";

type Props = { size?: number };
export const Spinner: React.FC<Props> = ({ size = 75 }) => {
  return (
    <AppLogo
      size={size}
      className="animate-in repeat-infinite spin-in-360 duration-2s ease-linear"
    />
  );
};
