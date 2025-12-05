import { useState, useCallback, useMemo } from 'react';
import { PAGINATION } from '@/constants';

export function useTablePagination(
  totalItems: number,
  itemsPerPage: number = PAGINATION.DEFAULT_ITEMS_PER_PAGE
) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => Math.ceil(totalItems / itemsPerPage),
    [totalItems, itemsPerPage]
  );

  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    },
    [totalPages]
  );

  const goToNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const paginatedData = useCallback(
    <DataType>(data: DataType[]): DataType[] => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      return data.slice(startIndex, startIndex + itemsPerPage);
    },
    [currentPage, itemsPerPage]
  );

  const getPageNumbers = useCallback(
    (maxButtons: number = PAGINATION.MAX_PAGINATION_BUTTONS) => {
      if (totalPages <= maxButtons) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      if (currentPage <= 3) {
        return Array.from({ length: maxButtons }, (_, i) => i + 1);
      }

      if (currentPage >= totalPages - 2) {
        return Array.from({ length: maxButtons }, (_, i) => totalPages - maxButtons + i + 1);
      }

      return Array.from({ length: maxButtons }, (_, i) => currentPage - 2 + i);
    },
    [currentPage, totalPages]
  );

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    resetPage,
    paginatedData,
    getPageNumbers,
  };
}
