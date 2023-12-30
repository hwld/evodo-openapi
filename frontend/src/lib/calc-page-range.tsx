type UsePageRangeArgs = {
  currentPage: number;
  totalPages: number;
  displayPages: number;
};
export const calcPageRange = ({
  currentPage,
  totalPages,
  displayPages,
}: UsePageRangeArgs) => {
  const halfDisplay = Math.floor(displayPages / 2);
  let start: number;
  let end: number;

  if (currentPage <= halfDisplay) {
    start = 1;
    end = displayPages;
  } else if (currentPage + halfDisplay >= totalPages) {
    start = totalPages - displayPages + 1;
    end = totalPages;
  } else {
    start = currentPage - halfDisplay;
    end = currentPage + halfDisplay;
  }

  if (start < 1) {
    start = 1;
  }
  if (end > totalPages) {
    end = totalPages;
  }

  const pageRange = [...new Array(end - start + 1)].map((_, i) => start + i);
  const before = start > 1;
  const after = end < totalPages;

  return { pageRange, before, after };
};
