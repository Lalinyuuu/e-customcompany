'use client';

import { Download, X } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { THAI_PROVINCES, getProvinceName } from '@/constants/thaiProvinces';

interface TableHeaderProps {
  searchQuery: string;
  provinceFilter: string;
  onSearchChange: (value: string) => void;
  onProvinceChange: (value: string) => void;
  onExport: () => void;
}

export function TableHeader({
  searchQuery,
  provinceFilter,
  onSearchChange,
  onProvinceChange,
  onExport,
}: TableHeaderProps) {
  const t = useTranslations('CompanyTable');
  const locale = useLocale();

  const handleSearchInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearchChange(e.target.value);
    },
    [onSearchChange]
  );

  const handleClearSearch = useCallback(() => {
    onSearchChange('');
  }, [onSearchChange]);

  const handleProvinceChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onProvinceChange(e.target.value);
    },
    [onProvinceChange]
  );

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 w-full">
        <div className="relative">
          <Input
            key="search-input"
            placeholder={t('search_placeholder')}
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="bg-background w-full"
            autoComplete="off"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-md transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <div className="flex gap-4 w-full md:w-auto">
        <Select value={provinceFilter} onChange={handleProvinceChange} className="flex-1 md:w-48">
          <option value="">{t('all_provinces')}</option>
          {THAI_PROVINCES.map((province) => (
            <option key={province.th} value={province.th}>
              {getProvinceName(province, locale)}
            </option>
          ))}
        </Select>
        <Button variant="outline" onClick={onExport} className="whitespace-nowrap">
          <Download className="h-4 w-4 mr-2" />
          {t('export')}
        </Button>
      </div>
    </div>
  );
}
