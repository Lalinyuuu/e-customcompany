'use client';

import { memo } from 'react';
import { Company } from '@/types/company';
import {
  ImportPermissionSection,
  OtherInformationSection,
  ReportSection,
  RubberRegistrationSection,
  TaxIncentivesSection,
} from '../sections/OtherInfoCardSections';

interface OtherInfoCardProps {
  formData: Omit<Company, 'id'>;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckboxChange: (name: string, checked: boolean) => void;
}

export const OtherInfoCard = memo(function OtherInfoCard({
  formData,
  errors,
  onChange,
  onCheckboxChange,
}: OtherInfoCardProps) {
  const sectionProps = { formData, errors, onChange, onCheckboxChange };

  return (
    <div className="space-y-6">
      <TaxIncentivesSection {...sectionProps} />
      <OtherInformationSection {...sectionProps} />
      <RubberRegistrationSection {...sectionProps} />
      <ImportPermissionSection {...sectionProps} />
      <ReportSection {...sectionProps} />
    </div>
  );
});
