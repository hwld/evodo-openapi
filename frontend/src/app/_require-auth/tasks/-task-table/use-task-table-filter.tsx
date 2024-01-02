import { useNavigate } from "@tanstack/react-router";
import { TaskSearchParams, tasksRoute } from "../page";

export const useTaskTableFilter = () => {
  const navigate = useNavigate();
  const search = tasksRoute.useSearch();
  const statusFilters = search.status_filter;
  const priorityFilters = search.priority_filter;

  const changeStatusFilter = (newFilter: TaskSearchParams["status_filter"]) => {
    navigate({ search: { ...search, page: 1, status_filter: newFilter } });
  };

  const changePriorityFilter = (
    newFilter: TaskSearchParams["priority_filter"],
  ) => {
    navigate({ search: { ...search, page: 1, priority_filter: newFilter } });
  };

  const handleClearFilter = () => {
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
    statusFilters,
    priorityFilters,
    changeStatusFilter,
    changePriorityFilter,
    handleClearFilter,
  };
};
