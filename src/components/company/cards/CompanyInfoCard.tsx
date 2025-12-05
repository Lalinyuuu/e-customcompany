'use client';

import { Building2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Company } from '@/types/company';

interface CompanyInfoCardProps {
  formData: Omit<Company, 'id'>;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  companySuggestions: Company[];
  showCompanySuggestions: boolean;
  highlightedIndex: number;
  listRef: React.RefObject<HTMLUListElement | null>;
  companySuggestionRef: React.RefObject<HTMLDivElement | null>;
  onSelectCompany: (company: Company) => void;
}

export const CompanyInfoCard = memo(function CompanyInfoCard({
  formData,
  errors,
  onChange,
  onKeyDown,
  companySuggestions,
  showCompanySuggestions,
  highlightedIndex,
  listRef,
  companySuggestionRef,
  onSelectCompany,
}: CompanyInfoCardProps) {
  const t = useTranslations('CompanyForm');

  return (
    <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="border-b bg-linear-to-r from-blue-50/50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10 pb-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          {t('company_info')}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-8">
        {/* Primary Identification */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider pb-2 border-b">
            {t('primary_identification')}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Name Group */}
            <div
              className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 relative"
              ref={companySuggestionRef}
            >
              <div className="space-y-2">
                <label htmlFor="nameTh" className="text-sm font-medium text-foreground">
                  {t('name_th')} <span className="text-red-500">*</span>
                </label>
                <Input
                  id="nameTh"
                  name="nameTh"
                  value={formData.nameTh}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  required
                  placeholder={t('placeholders.name_th')}
                  autoComplete="off"
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="nameEn" className="text-sm font-medium text-foreground">
                  {t('name_en')} <span className="text-red-500">*</span>
                </label>
                <Input
                  id="nameEn"
                  name="nameEn"
                  value={formData.nameEn}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  required
                  placeholder={t('placeholders.name_en')}
                  autoComplete="off"
                  className="bg-background/50"
                />
              </div>

              {/* Suggestions Dropdown */}
              {showCompanySuggestions && companySuggestions.length > 0 && (
                <div className="absolute z-50 w-full top-full mt-1 bg-popover text-popover-foreground border rounded-xl shadow-xl max-h-60 overflow-auto animate-in fade-in zoom-in-95 duration-200">
                  <ul className="py-1" ref={listRef}>
                    {companySuggestions.map((company, index) => (
                      <li
                        key={company.id}
                        className={`px-4 py-3 text-sm cursor-pointer transition-colors border-b last:border-0 ${
                          index === highlightedIndex
                            ? 'bg-accent text-accent-foreground'
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => onSelectCompany(company)}
                      >
                        <div className="font-medium">{company.nameTh}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{company.nameEn}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="taxId" className="text-sm font-medium text-foreground">
                {t('tax_id')} <span className="text-red-500">*</span>
              </label>
              <Input
                id="taxId"
                name="taxId"
                value={formData.taxId}
                onChange={onChange}
                required
                placeholder={t('placeholders.tax_id')}
                className={errors['taxId'] ? 'border-red-500 bg-red-50/10' : ''}
              />
              {errors['taxId'] && (
                <p className="text-xs text-red-500 font-medium">{errors['taxId']}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="branch" className="text-sm font-medium text-foreground">
                {t('branch')}
              </label>
              <Input
                id="branch"
                name="branch"
                value={formData.branch || ''}
                onChange={onChange}
                placeholder={t('placeholders.branch')}
              />
            </div>
          </div>
        </div>

        {/* Secondary Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider pb-2 border-b">
            {t('secondary_info')}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="customerCode" className="text-sm font-medium text-foreground">
                {t('customer_code')} <span className="text-red-500">*</span>
              </label>
              <Input
                id="customerCode"
                name="customerCode"
                value={formData.customerCode}
                onChange={onChange}
                required
                placeholder={t('placeholders.customer_code')}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="companyPrefix" className="text-sm font-medium text-foreground">
                {t('company_prefix')}
              </label>
              <Input
                id="companyPrefix"
                name="companyPrefix"
                value={formData.companyPrefix || ''}
                onChange={onChange}
                placeholder={t('placeholders.company_prefix')}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="companyGroupId" className="text-sm font-medium text-foreground">
                {t('company_group_id')}
              </label>
              <Input
                id="companyGroupId"
                name="companyGroupId"
                value={formData.companyGroupId || ''}
                onChange={onChange}
                placeholder={t('placeholders.company_group_id')}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="buyerSellerStatus" className="text-sm font-medium text-foreground">
                {t('buyer_seller_status')}
              </label>
              <Input
                id="buyerSellerStatus"
                name="buyerSellerStatus"
                value={formData.buyerSellerStatus || ''}
                onChange={onChange}
                placeholder={t('placeholders.buyer_seller_status')}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="buyerTradeLevel" className="text-sm font-medium text-foreground">
                {t('buyer_trade_level')}
              </label>
              <Input
                id="buyerTradeLevel"
                name="buyerTradeLevel"
                value={formData.buyerTradeLevel || ''}
                onChange={onChange}
                placeholder={t('placeholders.buyer_trade_level')}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="exporterCode19Twis" className="text-sm font-medium text-foreground">
                {t('exporter_code_19_twis')}
              </label>
              <Input
                id="exporterCode19Twis"
                name="exporterCode19Twis"
                value={formData.exporterCode19Twis || ''}
                onChange={onChange}
                placeholder={t('placeholders.exporter_code_19_twis')}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="warehouseCode" className="text-sm font-medium text-foreground">
                {t('warehouse_code')}
              </label>
              <Input
                id="warehouseCode"
                name="warehouseCode"
                value={formData.warehouseCode || ''}
                onChange={onChange}
                placeholder={t('placeholders.warehouse_code')}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="nswId" className="text-sm font-medium text-foreground">
                {t('nsw_id')}
              </label>
              <Input
                id="nswId"
                name="nswId"
                value={formData.nswId || ''}
                onChange={onChange}
                placeholder={t('placeholders.nsw_id')}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
