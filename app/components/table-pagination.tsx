import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { getPaginationNumbers } from "~/lib/paginationHelper";

interface Props {
  currentPage: number;
  totalEntries: number;
  onPrevPageClick: () => void;
  setCurrentPage: (page: number) => void;
  onNextPageClick: () => void;
  totalPages: number;
}

export default function TablePagination({
  currentPage,
  onNextPageClick,
  onPrevPageClick,
  setCurrentPage,
  totalEntries,
  totalPages,
}: Props) {
  const pagesInBetween = getPaginationNumbers(currentPage);
  return (
    <div className="flex items-center justify-between border-t p-4">
      <div>
        <span className="text-sm text-gray-500">
          Showing {currentPage * 12 - 12 + 1} to {currentPage * 12} of{" "}
          {totalEntries} entries
        </span>
      </div>
      <div className="flex gap-2 items-center justify-center">
        <Button
          onClick={onPrevPageClick}
          disabled={currentPage === 1}
          size="small"
        >
          Prev
        </Button>
        {pagesInBetween.map((p) => (
          <Button
            severity={currentPage === p ? "secondary" : "info"}
            key={p}
            size="small"
            onClick={() => setCurrentPage(p)}
          >
            {p}
          </Button>
        ))}
        <Button
          onClick={onNextPageClick}
          disabled={currentPage === totalPages}
          size="small"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
