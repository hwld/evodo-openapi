import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronsUpDownIcon,
} from "lucide-react";
import { SortStatus } from "./use-sort-task-table";

type SortedIconProps = { sortStatus: SortStatus };
export const TaskTableSortedIcon: React.FC<SortedIconProps> = ({
  sortStatus,
}) => {
  const size = 15;
  if (!sortStatus) {
    return <ChevronsUpDownIcon size={size} />;
  }
  if (sortStatus === "desc") {
    return <ChevronDownIcon size={size} />;
  }
  if (sortStatus === "asc") {
    return <ChevronUpIcon size={size} />;
  }
};
