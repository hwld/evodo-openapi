import { useNavigate } from "@tanstack/react-router";
import { TaskSearchParams, tasksRoute } from "../page";

type StatusFilterType = "status_filter";
type StatusFilters = TaskSearchParams[StatusFilterType];

type PriorityFilterType = "priority_filter";
type PriorityFilters = TaskSearchParams[PriorityFilterType];

type FilterType = StatusFilterType | PriorityFilterType;

type ChangeFilterArgs =
  | { type: StatusFilterType; value: StatusFilters[number] }
  | { type: PriorityFilterType; value: PriorityFilters[number] };

export const useTaskTableFilter = () => {
  const navigate = useNavigate();
  const search = tasksRoute.useSearch();

  // newFiltersはFilterTypeに応じた配列として受け取りたかったが、使いづらくなるのでunknownにしている。
  const changeFilter = (type: FilterType, newFilters: unknown[]) => {
    navigate({
      search: { ...search, page: 1, [type]: newFilters },
    });
  };

  const toggleFilter = ({ type, value }: ChangeFilterArgs) => {
    const filters = search[type];
    const isSelected = (filters as unknown[]).includes(value);

    if (isSelected) {
      changeFilter(
        type,
        filters.filter((f) => f !== value),
      );
    } else {
      changeFilter(type, [...filters, value]);
    }
  };

  const removeFilter = ({ type, value }: ChangeFilterArgs) => {
    const filters = search[type];

    changeFilter(
      type,
      filters.filter((f) => f !== value),
    );
  };

  const clearAllFilters = () => {
    navigate({
      search: {
        ...search,
        page: 1,
        status_filter: undefined,
        priority_filter: undefined,
      },
    });
  };

  return {
    statusFilters: search["status_filter"],
    priorityFilters: search["priority_filter"],
    toggleFilter,
    removeFilter,
    clearAllFilters,
  };
};
