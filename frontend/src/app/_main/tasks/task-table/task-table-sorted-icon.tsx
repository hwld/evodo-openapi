import { SortDirection } from "@tanstack/react-table";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronsUpDownIcon,
} from "lucide-react";

type SortedIconProps = { sorted: false | SortDirection };
export const SortedIcon: React.FC<SortedIconProps> = ({ sorted }) => {
  const size = 15;
  if (!sorted) {
    return <ChevronsUpDownIcon size={size} />;
  }
  if (sorted === "asc") {
    return <ChevronDownIcon size={size} />;
  }
  if (sorted === "desc") {
    return <ChevronUpIcon size={size} />;
  }
};
