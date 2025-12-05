import { useMemo } from 'react';
import { Company } from '@/types/company';
import { SortField, SortDirection } from './useTableSort';

export function useTableFilter(
  data: Company[] | undefined,
  searchQuery: string,
  provinceFilter: string,
  sortField: SortField | null,
  sortDirection: SortDirection
) {
  const processedData = useMemo(() => {
    if (!data) return [];

    let filtered = data.filter((company) => {
      const matchesSearch =
        company.nameTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.taxId.includes(searchQuery) ||
        company.customerCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.phone.includes(searchQuery);

      const matchesProvince = !provinceFilter || company.province === provinceFilter;

      return matchesSearch && matchesProvince;
    });

    if (sortField && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: string | number = a[sortField] || '';
        let bValue: string | number = b[sortField] || '';

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
        }
        if (typeof bValue === 'string') {
          bValue = bValue.toLowerCase();
        }

        if (sortDirection === 'asc') {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        } else {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
      });
    }

    return filtered;
  }, [data, searchQuery, provinceFilter, sortField, sortDirection]);

  return processedData;
}
