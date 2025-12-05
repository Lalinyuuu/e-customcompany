'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Company } from '@/types/company';
import { getProvinceByThai, getProvinceName } from '@/constants/thaiProvinces';
import { SortButton } from './TableSortButton';
import { SortField, SortDirection } from '../hooks/useTableSort';

interface TableBodyProps {
  companies: Company[];
  sortField: SortField | null;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onDeleteClick: (company: Company) => void;
  searchQuery: string;
}

export function TableBody({
  companies,
  sortField,
  sortDirection,
  onSort,
  onDeleteClick,
  searchQuery,
}: TableBodyProps) {
  const t = useTranslations('CompanyTable');
  const locale = useLocale();

  if (companies.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="p-8 text-center text-muted-foreground">
          {t('no_results')} {searchQuery && `"${searchQuery}"`}
        </td>
      </tr>
    );
  }

  return (
    <>
      {companies.map((company) => (
        <tr key={company.id} className="hover:bg-muted/50 transition-colors">
          <td className="p-4 font-medium">{company.customerCode}</td>
          <td className="p-4">
            <div className="font-medium">{company.nameTh}</div>
            <div className="text-xs text-muted-foreground">{company.nameEn}</div>
          </td>
          <td className="p-4 text-muted-foreground font-mono">{company.taxId}</td>
          <td className="p-4 text-muted-foreground">
            {locale === 'en' && company.addressEn
              ? company.addressEn
              : (() => {
                  const provinceData = getProvinceByThai(company.province);
                  const provinceName = provinceData
                    ? getProvinceName(provinceData, locale)
                    : company.province;
                  return `${company.subDistrict} ${provinceName}`;
                })()}
          </td>
          <td className="p-4 text-muted-foreground whitespace-nowrap">{company.phone}</td>
          <td className="p-4 text-right space-x-3 whitespace-nowrap">
            <Link
              href={`/companies/${company.id}`}
              className="text-primary hover:underline font-medium"
            >
              {t('actions.edit')}
            </Link>
            <button
              className="text-red-600 dark:text-red-400 hover:underline font-medium cursor-pointer"
              onClick={() => onDeleteClick(company)}
            >
              {t('actions.delete')}
            </button>
          </td>
        </tr>
      ))}
    </>
  );
}

export function TableHead({
  sortField,
  sortDirection,
  onSort,
}: {
  sortField: SortField | null;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}) {
  const t = useTranslations('CompanyTable');

  return (
    <thead className="bg-muted/50 text-muted-foreground">
      <tr>
        <th className="p-4 text-left font-medium whitespace-nowrap">
          <SortButton
            field="customerCode"
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
          >
            {t('headers.code')}
          </SortButton>
        </th>
        <th className="p-4 text-left font-medium">
          <SortButton
            field="nameTh"
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
          >
            {t('headers.name')}
          </SortButton>
        </th>
        <th className="p-4 text-left font-medium whitespace-nowrap">
          <SortButton
            field="taxId"
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
          >
            {t('headers.tax_id')}
          </SortButton>
        </th>
        <th className="p-4 text-left font-medium">
          <SortButton
            field="province"
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
          >
            {t('headers.location')}
          </SortButton>
        </th>
        <th className="p-4 text-left font-medium whitespace-nowrap">
          <SortButton
            field="phone"
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
          >
            {t('headers.phone')}
          </SortButton>
        </th>
        <th className="p-4 text-right font-medium">{t('headers.actions')}</th>
      </tr>
    </thead>
  );
}
