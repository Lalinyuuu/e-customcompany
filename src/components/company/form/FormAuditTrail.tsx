'use client';

import { useTranslations } from 'next-intl';
import { memo } from 'react';
import { Company } from '@/types/company';

interface FormAuditTrailProps {
  formData: Omit<Company, 'id'>;
}

export const FormAuditTrail = memo(function FormAuditTrail({ formData }: FormAuditTrailProps) {
  const t = useTranslations('CompanyForm');

  if (!formData.createdAt && !formData.updatedAt) {
    return null;
  }

  return (
    <div className="text-sm text-muted-foreground/80 text-center pt-8 pb-4">
      {formData.createdAt && (
        <span className="mr-4">
          {t('created')}: {new Date(formData.createdAt).toLocaleString('th-TH')}
          {formData.createdBy && ` ${t('by')} ${formData.createdBy}`}
        </span>
      )}
      {formData.updatedAt && (
        <span>
          {t('last_updated')}: {new Date(formData.updatedAt).toLocaleString('th-TH')}
          {formData.updatedBy && ` ${t('by')} ${formData.updatedBy}`}
        </span>
      )}
    </div>
  );
});
