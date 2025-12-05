'use client';

import { Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Company } from '@/types/company';
import {
  CompensationInfoSection,
  DocumentSigningSection,
  RestrictionsSection,
  UsageRightsSection,
} from '../sections/SettingsCardSections';

interface SettingsCardProps {
  formData: Omit<Company, 'id'>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckboxChange: (name: string, checked: boolean) => void;
}

export const SettingsCard = memo(function SettingsCard({
  formData,
  onChange,
  onCheckboxChange,
}: SettingsCardProps) {
  const t = useTranslations('CompanyForm');
  const sectionProps = { formData, onChange, onCheckboxChange };

  return (
    <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="border-b bg-linear-to-r from-purple-50/50 to-purple-100/30 dark:from-purple-950/20 dark:to-purple-900/10 pb-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Settings className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          {t('settings_permissions')}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-8">
        <DocumentSigningSection {...sectionProps} />
        <RestrictionsSection {...sectionProps} />
        <UsageRightsSection {...sectionProps} />
        <CompensationInfoSection {...sectionProps} />
      </CardContent>
    </Card>
  );
});
