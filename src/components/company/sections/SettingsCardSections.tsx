'use client';

import { Ban, FileText, Globe, Key, Package, Ship } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/Input';
import { ToggleCard } from '@/components/ui/ToggleCard';
import { Company } from '@/types/company';

interface SectionProps {
  formData: Omit<Company, 'id'>;
  onCheckboxChange: (name: string, checked: boolean) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DocumentSigningSection({ formData, onCheckboxChange }: SectionProps) {
  const t = useTranslations('CompanyForm');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b">
        <Key className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          {t('document_signing')}
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <ToggleCard
            checked={formData.customerSignsElectronically || false}
            onCheckedChange={(c) => onCheckboxChange('customerSignsElectronically', c)}
            label={t('customer_signs_electronically')}
            icon={Key}
            variant="primary"
          />
        </div>
        <ToggleCard
          checked={formData.isSignInvoice}
          onCheckedChange={(c) => onCheckboxChange('isSignInvoice', c)}
          label={t('sign_invoice')}
          icon={FileText}
          variant="default"
        />
        <ToggleCard
          checked={formData.isSignCustomsIn}
          onCheckedChange={(c) => onCheckboxChange('isSignCustomsIn', c)}
          label={t('sign_customs_in')}
          icon={Ship}
          variant="default"
        />
        <ToggleCard
          checked={formData.isSignCustomsOut}
          onCheckedChange={(c) => onCheckboxChange('isSignCustomsOut', c)}
          label={t('sign_customs_out')}
          icon={Globe}
          variant="default"
        />
        <ToggleCard
          checked={formData.isSignMovementControl || false}
          onCheckedChange={(c) => onCheckboxChange('isSignMovementControl', c)}
          label={t('sign_movement_control')}
          icon={Package}
          variant="default"
        />
        <ToggleCard
          checked={formData.isSignShortShip || false}
          onCheckedChange={(c) => onCheckboxChange('isSignShortShip', c)}
          label={t('sign_short_ship')}
          icon={Ship}
          variant="default"
        />
      </div>
    </div>
  );
}

export function RestrictionsSection({ formData, onCheckboxChange }: SectionProps) {
  const t = useTranslations('CompanyForm');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b">
        <Ban className="h-4 w-4 text-red-500" />
        <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          {t('not_allow_sign_title')}
        </h4>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ToggleCard
          checked={formData.isNotAllowSignInvoice || false}
          onCheckedChange={(c) => onCheckboxChange('isNotAllowSignInvoice', c)}
          label={t('not_allow_sign_invoice')}
          icon={Ban}
          variant="danger"
        />
        <ToggleCard
          checked={formData.isNotAllowSignCustomsOut || false}
          onCheckedChange={(c) => onCheckboxChange('isNotAllowSignCustomsOut', c)}
          label={t('not_allow_sign_customs_out')}
          icon={Ban}
          variant="danger"
        />
        <ToggleCard
          checked={formData.isNotAllowSignCustomsIn || false}
          onCheckedChange={(c) => onCheckboxChange('isNotAllowSignCustomsIn', c)}
          label={t('not_allow_sign_customs_in')}
          icon={Ban}
          variant="danger"
        />
        <ToggleCard
          checked={formData.isNotAllowSignMovementControl || false}
          onCheckedChange={(c) => onCheckboxChange('isNotAllowSignMovementControl', c)}
          label={t('not_allow_sign_movement_control')}
          icon={Ban}
          variant="danger"
        />
        <ToggleCard
          checked={formData.isNotAllowSignShortShip || false}
          onCheckedChange={(c) => onCheckboxChange('isNotAllowSignShortShip', c)}
          label={t('not_allow_sign_short_ship')}
          icon={Ban}
          variant="danger"
        />
      </div>
    </div>
  );
}

export function UsageRightsSection({ formData, onChange }: SectionProps) {
  const t = useTranslations('CompanyForm');

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider pb-2 border-b">
        {t('usage_rights')}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { id: 'usageGeneral', value: 'GENERAL', label: t('rights_general') },
          { id: 'usageGold', value: 'GOLD_CARD', label: t('rights_gold') },
          { id: 'usageBroker', value: 'BROKER', label: t('rights_broker') },
        ].map((option) => (
          <label
            key={option.id}
            className={`
                            relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                            ${
                              formData.usageType === option.value
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-transparent bg-secondary hover:bg-secondary/80 text-muted-foreground'
                            }
                        `}
          >
            <input
              type="radio"
              id={option.id}
              name="usageType"
              value={option.value}
              checked={formData.usageType === option.value}
              onChange={onChange}
              className="sr-only"
            />
            <span className="font-semibold">{option.label}</span>
          </label>
        ))}
      </div>

      {formData.usageType === 'GOLD_CARD' && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300 pt-2">
          <Input
            name="goldCardNumber"
            value={formData.goldCardNumber || ''}
            onChange={onChange}
            placeholder={t('gold_card_no')}
            className="max-w-md"
          />
        </div>
      )}

      {formData.usageType === 'BROKER' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300 pt-2">
          <Input
            name="brokerNumber"
            value={formData.brokerNumber || ''}
            onChange={onChange}
            placeholder={t('broker_no')}
          />
          <Input
            name="agentCustomerSequence"
            value={formData.agentCustomerSequence || ''}
            onChange={onChange}
            placeholder={t('agent_customer_sequence')}
          />
        </div>
      )}
    </div>
  );
}

export function CompensationInfoSection({ formData, onChange }: SectionProps) {
  const t = useTranslations('CompanyForm');

  return (
    <div className="space-y-4 pt-4 border-t">
      <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
        {t('compensation_info')}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="taxRefundApplicantCode" className="text-sm font-medium">
            {t('tax_refund_applicant_code')}
          </label>
          <Input
            id="taxRefundApplicantCode"
            name="taxRefundApplicantCode"
            value={formData.taxRefundApplicantCode || ''}
            onChange={onChange}
            placeholder={t('placeholders.tax_refund_applicant_code')}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="compensationRecipientRegNo" className="text-sm font-medium">
            {t('compensation_recipient_reg_no')}
          </label>
          <Input
            id="compensationRecipientRegNo"
            name="compensationRecipientRegNo"
            value={formData.compensationRecipientRegNo || ''}
            onChange={onChange}
            placeholder={t('placeholders.compensation_recipient_reg_no')}
          />
        </div>
      </div>
    </div>
  );
}
