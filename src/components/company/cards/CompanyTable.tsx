'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo, useCallback, memo, useEffect } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useCompanies, useDeleteCompany, useExportCompanies } from '@/hooks/useCompanies';
import { logger } from '@/lib/logger';
import { Company } from '@/types/company';
import { useTableFilter } from '../hooks/useTableFilter';
import { useTablePagination } from '../hooks/useTablePagination';
import { useTableSort, SortField } from '../hooks/useTableSort';
import { TableHeader } from './TableHeader';
import { TableBody, TableHead } from './TableBody';
import { TablePagination } from './TablePagination';
import { TableLoadingSkeleton } from './TableLoadingSkeleton';
import { CompanyListCard } from './CompanyListCard';

function CompanyTable() {
  const t = useTranslations('CompanyTable');
  const [searchQuery, setSearchQuery] = useState('');
  const [provinceFilter, setProvinceFilter] = useState<string>('');
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; company: Company | null }>({
    isOpen: false,
    company: null,
  });

  const { data, isLoading } = useCompanies(searchQuery);
  const deleteCompanyMutation = useDeleteCompany();
  const exportCompaniesMutation = useExportCompanies();

  const { sortField, sortDirection, handleSort } = useTableSort();
  const processedData = useTableFilter(data, searchQuery, provinceFilter, sortField, sortDirection);

  const {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedData: getPaginatedData,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    resetPage,
    getPageNumbers,
  } = useTablePagination(processedData.length);

  const paginatedData = useMemo(
    () => getPaginatedData(processedData),
    [getPaginatedData, processedData]
  );

  useEffect(() => {
    resetPage();
  }, [searchQuery, provinceFilter, resetPage]);

  const handleSortWithReset = useCallback(
    (field: SortField) => {
      handleSort(field);
      resetPage();
    },
    [handleSort, resetPage]
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleProvinceChange = useCallback((value: string) => {
    setProvinceFilter(value);
  }, []);

  const handleExport = useCallback(async () => {
    try {
      const blob = await exportCompaniesMutation.mutateAsync('csv');
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `companies-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(anchor);
      anchor.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(anchor);
      toast.success(t('export_success'));
    } catch (error) {
      logger.error('Export error', error instanceof Error ? error : new Error(String(error)));
      toast.error(t('export_error'), {
        description: t('export_error_desc'),
      });
    }
  }, [t, exportCompaniesMutation]);

  const handleDeleteClick = useCallback((company: Company) => {
    setDeleteDialog({ isOpen: true, company });
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteDialog.company) return;

    try {
      await deleteCompanyMutation.mutateAsync(deleteDialog.company.id);
      toast.success(t('delete_success'), {
        description: `${t('actions.delete')} "${deleteDialog.company.nameTh}" ${t('of')} ${t('companies')}`,
      });
      setDeleteDialog({ isOpen: false, company: null });
    } catch (error) {
      logger.error(
        'Error deleting company',
        error instanceof Error ? error : new Error(String(error))
      );
      toast.error(t('delete_error_general'), {
        description: t('delete_error_general_desc'),
      });
    }
  }, [deleteDialog.company, deleteCompanyMutation, t]);

  if (isLoading) {
    return <TableLoadingSkeleton />;
  }

  if (!data) {
    return <div className="p-8 text-center text-destructive">{t('failed')}</div>;
  }

  return (
    <div className="space-y-4">
      <TableHeader
        searchQuery={searchQuery}
        provinceFilter={provinceFilter}
        onSearchChange={handleSearchChange}
        onProvinceChange={handleProvinceChange}
        onExport={handleExport}
      />

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {paginatedData.map((company) => (
          <CompanyListCard key={company.id} company={company} onDeleteClick={handleDeleteClick} />
        ))}
        {paginatedData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
            {t('no_data')}
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="overflow-x-auto scroll-container">
          <table className="w-full text-sm">
            <TableHead
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSortWithReset}
            />
            <tbody className="divide-y divide-border">
              <TableBody
                companies={paginatedData}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSortWithReset}
                onDeleteClick={handleDeleteClick}
                searchQuery={searchQuery}
              />
            </tbody>
          </table>
        </div>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={processedData.length}
        onPrevious={goToPreviousPage}
        onNext={goToNextPage}
        onPageClick={goToPage}
        getPageNumbers={getPageNumbers}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, company: null })}
        onConfirm={handleDeleteConfirm}
        title={t('actions.delete')}
        message={
          deleteDialog.company
            ? `${t('actions.confirm_delete')} "${deleteDialog.company.nameTh}"?`
            : t('actions.confirm_delete')
        }
        confirmText={t('actions.delete')}
        cancelText={t('actions.cancel')}
        variant="destructive"
      />
    </div>
  );
}

export default memo(CompanyTable);
