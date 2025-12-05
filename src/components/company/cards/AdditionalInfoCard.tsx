'use client';

import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Company } from '@/types/company';

interface AdditionalInfoCardProps {
  formData: Omit<Company, 'id'>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AdditionalInfoCard = memo(function AdditionalInfoCard({
  formData,
  onChange,
}: AdditionalInfoCardProps) {
  const t = useTranslations('CompanyForm');

  return (
    <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="border-b bg-linear-to-r from-indigo-50/50 to-indigo-100/30 dark:from-indigo-950/20 dark:to-indigo-900/10 pb-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Info className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          {t('additional_info')}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 grid gap-4">
        <div className="space-y-2">
          <label htmlFor="documentSenderNumber" className="text-sm font-medium text-foreground">
            {t('doc_sender_no')}
          </label>
          <Input
            id="documentSenderNumber"
            name="documentSenderNumber"
            value={formData.documentSenderNumber}
            onChange={onChange}
            placeholder={t('placeholders.doc_sender_no')}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="boiRefNumber" className="text-sm font-medium text-foreground">
            {t('boi_ref_no')}
          </label>
          <Input
            id="boiRefNumber"
            name="boiRefNumber"
            value={formData.boiRefNumber}
            onChange={onChange}
            placeholder={t('placeholders.boi_ref_no')}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="aeoRefNumber" className="text-sm font-medium text-foreground">
            {t('aeo_ref_no')}
          </label>
          <Input
            id="aeoRefNumber"
            name="aeoRefNumber"
            value={formData.aeoRefNumber}
            onChange={onChange}
            placeholder={t('placeholders.aeo_ref_no')}
          />
        </div>
      </CardContent>
    </Card>
  );
});
