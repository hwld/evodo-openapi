import { ReactNode } from "react";
import axios from "axios";

export const AxiosProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  axios.defaults.baseURL = `${import.meta.env.VITE_API_URL}`;
  return children;
};
