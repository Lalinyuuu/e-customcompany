'use client';

import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { SortField, SortDirection } from '../hooks/useTableSort';

interface SortButtonProps {
  field: SortField;
  children: React.ReactNode;
  sortField: SortField | null;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

export function SortButton({ field, children, sortField, sortDirection, onSort }: SortButtonProps) {
  return (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1 hover:text-primary transition-colors"
    >
      {children}
      {sortField === field ? (
        sortDirection === 'asc' ? (
          <ArrowUp className="h-3 w-3" />
        ) : (
          <ArrowDown className="h-3 w-3" />
        )
      ) : (
        <ArrowUpDown className="h-3 w-3 opacity-50" />
      )}
    </button>
  );
}
