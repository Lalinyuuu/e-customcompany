'use client';

import { Building2, FileBarChart, Key, Lock, Package, Receipt, Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';
import { Company } from '@/types/company';

interface SectionProps {
  formData: Omit<Company, 'id'>;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckboxChange: (name: string, checked: boolean) => void;
}

export function TaxIncentivesSection({ formData, onChange }: SectionProps) {
  const t = useTranslations('CompanyForm');

  return (
    <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="border-b bg-linear-to-r from-blue-50/50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10 pb-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Receipt className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          {t('tax_incentives_id')}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="bondedWarehouseProduction"
              className="text-sm font-medium text-foreground"
            >
              {t('bonded_warehouse_production')}
            </label>
            <Input
              id="bondedWarehouseProduction"
              name="bondedWarehouseProduction"
              value={formData.bondedWarehouseProduction || ''}
              onChange={onChange}
              placeholder={t('placeholders.bonded_warehouse_production')}
              aria-label={t('bonded_warehouse_production')}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="freeZoneOperator" className="text-sm font-medium text-foreground">
              {t('free_zone_operator')}
            </label>
            <Input
              id="freeZoneOperator"
              name="freeZoneOperator"
              value={formData.freeZoneOperator || ''}
              onChange={onChange}
              placeholder={t('placeholders.free_zone_operator')}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="freeTradeZoneOperator" className="text-sm font-medium text-foreground">
              {t('free_trade_zone_operator')}
            </label>
            <Input
              id="freeTradeZoneOperator"
              name="freeTradeZoneOperator"
              value={formData.freeTradeZoneOperator || ''}
              onChange={onChange}
              placeholder={t('placeholders.free_trade_zone_operator')}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="exporterCode19Bis" className="text-sm font-medium text-foreground">
              {t('exporter_code_19_bis')}
            </label>
            <Input
              id="exporterCode19Bis"
              name="exporterCode19Bis"
              value={formData.exporterCode19Bis || ''}
              onChange={onChange}
              placeholder={t('placeholders.exporter_code_19_bis')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function OtherInformationSection({ formData, onChange, onCheckboxChange }: SectionProps) {
  const t = useTranslations('CompanyForm');

  return (
    <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="border-b bg-linear-to-r from-purple-50/50 to-purple-100/30 dark:from-purple-950/20 dark:to-purple-900/10 pb-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          {t('other_info')}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="securityDepositNo" className="text-sm font-medium text-foreground">
              {t('security_deposit_no')}
            </label>
            <Input
              id="securityDepositNo"
              name="securityDepositNo"
              value={formData.securityDepositNo || ''}
              onChange={onChange}
              placeholder={t('placeholders.security_deposit_no')}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="bondNo" className="text-sm font-medium text-foreground">
              {t('bond_no')}
            </label>
            <Input
              id="bondNo"
              name="bondNo"
              value={formData.bondNo || ''}
              onChange={onChange}
              placeholder={t('placeholders.bond_no')}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="depositNo" className="text-sm font-medium text-foreground">
              {t('deposit_no')}
            </label>
            <Input
              id="depositNo"
              name="depositNo"
              value={formData.depositNo || ''}
              onChange={onChange}
              placeholder={t('placeholders.deposit_no')}
            />
          </div>
          <div className="space-y-2 flex items-end">
            <label className="flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer w-full">
              <Checkbox
                checked={formData.payDepartmentFees || false}
                onChange={(e) => onCheckboxChange('payDepartmentFees', e.target.checked)}
              />
              <span className="text-sm font-medium">
                {t('pay_department_fees')}{' '}
                <span className="text-muted-foreground">({t('per_copy_200_baht')})</span>
              </span>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function RubberRegistrationSection({ formData, onChange }: SectionProps) {
  const t = useTranslations('CompanyForm');

  return (
    <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="border-b bg-linear-to-r from-green-50/50 to-green-100/30 dark:from-green-950/20 dark:to-green-900/10 pb-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
          {t('rubber_registration')}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="rubberTraderRegNo" className="text-sm font-medium text-foreground">
              {t('rubber_trader_reg_no')}
            </label>
            <Input
              id="rubberTraderRegNo"
              name="rubberTraderRegNo"
              value={formData.rubberTraderRegNo || ''}
              onChange={onChange}
              placeholder={t('placeholders.rubber_trader_reg_no')}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="rubberExporterRegNo" className="text-sm font-medium text-foreground">
              {t('rubber_exporter_reg_no')}
            </label>
            <Input
              id="rubberExporterRegNo"
              name="rubberExporterRegNo"
              value={formData.rubberExporterRegNo || ''}
              onChange={onChange}
              placeholder={t('placeholders.rubber_exporter_reg_no')}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="ltrRubberProducerRegNo" className="text-sm font-medium text-foreground">
              {t('ltr_rubber_producer_reg_no')}
            </label>
            <Input
              id="ltrRubberProducerRegNo"
              name="ltrRubberProducerRegNo"
              value={formData.ltrRubberProducerRegNo || ''}
              onChange={onChange}
              placeholder={t('placeholders.ltr_rubber_producer_reg_no')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ImportPermissionSection({ formData, errors, onChange }: SectionProps) {
  const t = useTranslations('CompanyForm');

  return (
    <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="border-b bg-linear-to-r from-orange-50/50 to-orange-100/30 dark:from-orange-950/20 dark:to-orange-900/10 pb-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Lock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          {t('import_permission_request')}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="importPermissionLoginName"
              className="text-sm font-medium text-foreground flex items-center gap-2"
            >
              <Key className="h-3.5 w-3.5 text-muted-foreground" />
              {t('login_name')}
            </label>
            <Input
              id="importPermissionLoginName"
              name="importPermissionLoginName"
              value={formData.importPermissionLoginName || ''}
              onChange={onChange}
              placeholder={t('placeholders.login_name')}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="importPermissionPassword"
              className="text-sm font-medium text-foreground"
            >
              {t('password')}
            </label>
            <Input
              id="importPermissionPassword"
              name="importPermissionPassword"
              type="password"
              value={formData.importPermissionPassword || ''}
              onChange={onChange}
              placeholder={t('placeholders.password')}
              className={errors['importPermissionPassword'] ? 'border-red-500 bg-red-50/10' : ''}
            />
            {errors['importPermissionPassword'] && (
              <p className="text-xs text-red-500 font-medium">
                {errors['importPermissionPassword']}
              </p>
            )}
          </div>
          <div className="space-y-2 md:col-span-2">
            <label
              htmlFor="importPermissionConfirmPassword"
              className="text-sm font-medium text-foreground"
            >
              {t('confirm_password')}
            </label>
            <Input
              id="importPermissionConfirmPassword"
              name="importPermissionConfirmPassword"
              type="password"
              value={formData.importPermissionConfirmPassword || ''}
              onChange={onChange}
              placeholder={t('placeholders.confirm_password')}
              className={
                errors['importPermissionConfirmPassword'] ? 'border-red-500 bg-red-50/10' : ''
              }
            />
            {errors['importPermissionConfirmPassword'] && (
              <p className="text-xs text-red-500 font-medium">
                {errors['importPermissionConfirmPassword']}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReportSection({ formData, errors, onChange }: SectionProps) {
  const t = useTranslations('CompanyForm');

  return (
    <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="border-b bg-linear-to-r from-indigo-50/50 to-indigo-100/30 dark:from-indigo-950/20 dark:to-indigo-900/10 pb-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <FileBarChart className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          {t('report')}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="importReportForm" className="text-sm font-medium text-foreground">
              {t('import_report_form')}
            </label>
            <Input
              id="importReportForm"
              name="importReportForm"
              value={formData.importReportForm || ''}
              onChange={onChange}
              placeholder={t('placeholders.import_report_form')}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="exportReportForm" className="text-sm font-medium text-foreground">
              {t('export_report_form')}
            </label>
            <Input
              id="exportReportForm"
              name="exportReportForm"
              value={formData.exportReportForm || ''}
              onChange={onChange}
              placeholder={t('placeholders.export_report_form')}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="exportReportFormAfterCustoms"
              className="text-sm font-medium text-foreground"
            >
              {t('export_report_form_after_customs')}
            </label>
            <Input
              id="exportReportFormAfterCustoms"
              name="exportReportFormAfterCustoms"
              value={formData.exportReportFormAfterCustoms || ''}
              onChange={onChange}
              placeholder={t('placeholders.export_report_form_after_customs')}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="rbsMail"
              className="text-sm font-medium text-foreground flex items-center gap-2"
            >
              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
              {t('rbs_mail')}
            </label>
            <Input
              id="rbsMail"
              name="rbsMail"
              type="email"
              value={formData.rbsMail || ''}
              onChange={onChange}
              placeholder={t('placeholders.rbs_mail')}
              className={errors['rbsMail'] ? 'border-red-500 bg-red-50/10' : ''}
            />
            {errors['rbsMail'] && (
              <p className="text-xs text-red-500 font-medium">{errors['rbsMail']}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
