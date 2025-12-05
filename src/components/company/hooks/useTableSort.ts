import { useState, useCallback } from 'react';

export type SortField = 'customerCode' | 'nameTh' | 'taxId' | 'province' | 'phone';
export type SortDirection = 'asc' | 'desc' | null;

export function useTableSort() {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        if (sortDirection === 'asc') {
          setSortDirection('desc');
        } else if (sortDirection === 'desc') {
          setSortField(null);
          setSortDirection(null);
        } else {
          setSortDirection('asc');
        }
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    },
    [sortField, sortDirection]
  );

  const resetSort = useCallback(() => {
    setSortField(null);
    setSortDirection(null);
  }, []);

  return {
    sortField,
    sortDirection,
    handleSort,
    resetSort,
  };
}
