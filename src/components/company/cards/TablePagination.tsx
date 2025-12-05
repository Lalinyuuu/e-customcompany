'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPrevious: () => void;
  onNext: () => void;
  onPageClick: (page: number) => void;
  getPageNumbers: () => number[];
}

export function TablePagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPrevious,
  onNext,
  onPageClick,
  getPageNumbers,
}: TablePaginationProps) {
  const t = useTranslations('CompanyTable');

  if (totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-xs text-muted-foreground">
        {t('showing')} {startItem}-{endItem} {t('of')} {totalItems} {t('companies')}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onPrevious} disabled={currentPage === 1}>
          {t('previous')}
        </Button>
        <div className="flex items-center gap-1">
          {getPageNumbers().map((pageNum: number) => (
            <Button
              key={`page-${pageNum}`}
              variant={currentPage === pageNum ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPageClick(pageNum)}
              className="min-w-10"
            >
              {pageNum}
            </Button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={onNext} disabled={currentPage === totalPages}>
          {t('next')}
        </Button>
      </div>
    </div>
  );
}
