// --- Import Lucide Icons at the top of your component file ---
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

// --- NEW & IMPROVED: Pagination Component ---
export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 3; // Show fewer numbers for a cleaner look
    const pagesOnEachSide = 1;

    if (totalPages <= 5) {
      // If 5 or fewer pages, show all of them
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show the first page
      pages.push(1);

      // Add left ellipsis if needed
      if (currentPage > pagesOnEachSide + 2) {
        pages.push("...");
      }

      // Determine the range of middle pages
      let startPage = Math.max(2, currentPage - pagesOnEachSide);
      let endPage = Math.min(totalPages - 1, currentPage + pagesOnEachSide);

      if (currentPage <= 3) {
        endPage = 4;
      }
      if (currentPage > totalPages - 3) {
        startPage = totalPages - 3;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add right ellipsis if needed
      if (currentPage < totalPages - pagesOnEachSide - 1) {
        pages.push("...");
      }

      // Always show the last page
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <nav
      className="flex items-center justify-center space-x-2 mt-16"
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        aria-label="Go to previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page Number Buttons */}
      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <div
            key={`ellipsis-${index}`}
            className="flex items-center justify-center w-10 h-10 text-gray-400"
          >
            <MoreHorizontal className="w-5 h-5" />
          </div>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex items-center justify-center w-10 h-10 border rounded-lg transition-colors font-medium ${
              currentPage === page
                ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                : "bg-white border-gray-300 hover:bg-gray-50"
            }`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        aria-label="Go to next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </nav>
  );
};
