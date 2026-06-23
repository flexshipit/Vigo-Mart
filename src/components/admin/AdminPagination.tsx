import { ChevronLeft, ChevronRight } from "lucide-react";

type AdminPaginationProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
};

export default function AdminPagination({
  page,
  totalPages,
  totalItems,
  limit,
  onPageChange,
  isLoading = false,
}: AdminPaginationProps) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, totalItems);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
    .reduce<(number | "...")[]>((acc, p, i, arr) => {
      if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
      acc.push(p);
      return acc;
    }, []);

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p lang="en" className="text-sm text-slate-500">
        Showing {start}–{end} of {totalItems} orders
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || isLoading}
          className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </button>

        {pages.map((item, index) =>
          item === "..." ? (
            <span key={`ellipsis-${index}`} className="px-2 text-slate-400">
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              disabled={isLoading}
              lang="en"
              className={`min-w-9 rounded-md px-3 py-2 text-sm font-medium ${
                item === page
                  ? "bg-primary text-white"
                  : "border border-slate-200 text-slate-700 hover:bg-slate-50"
              } disabled:opacity-50`}
            >
              {item}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || isLoading}
          className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
