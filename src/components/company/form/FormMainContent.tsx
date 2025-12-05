'use client';

import { memo } from 'react';
import { ThaiAddress } from '@/types/address';
import { Company } from '@/types/company';
import { AdditionalInfoCard } from '../cards/AdditionalInfoCard';
import { AddressCard } from '../cards/AddressCard';
import { AIExplanationCard } from '../cards/AIExplanationCard';
import { CompanyInfoCard } from '../cards/CompanyInfoCard';
import { ContactCard } from '../cards/ContactCard';
import { SettingsCard } from '../cards/SettingsCard';

interface FormMainContentProps {
  formData: Omit<Company, 'id'>;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckboxChange: (name: string, checked: boolean) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  companySuggestions: Company[];
  showCompanySuggestions: boolean;
  highlightedIndex: number;
  listRef: React.RefObject<HTMLUListElement | null>;
  companySuggestionRef: React.RefObject<HTMLDivElement | null>;
  onSelectCompany: (company: Company) => void;
  isAutoFilling: boolean;
  autoFillSuccess: boolean;
  autoFillError: string | null;
  currentStep?: 'analyzing' | 'searching' | 'filling' | null;
  onAutoFill: () => void;
  suggestions: ThaiAddress[];
  showSuggestions: boolean;
  isSearchingZipcode?: boolean;
  suggestionRef: React.RefObject<HTMLDivElement | null>;
  onSelectAddress: (address: ThaiAddress) => void;
}

export const FormMainContent = memo(function FormMainContent({
  formData,
  errors,
  onChange,
  onCheckboxChange,
  onKeyDown,
  companySuggestions,
  showCompanySuggestions,
  highlightedIndex,
  listRef,
  companySuggestionRef,
  onSelectCompany,
  isAutoFilling,
  autoFillSuccess,
  autoFillError,
  currentStep,
  onAutoFill,
  suggestions,
  showSuggestions,
  isSearchingZipcode,
  suggestionRef,
  onSelectAddress,
}: FormMainContentProps) {
  return (
    <div className="space-y-6">
      {/* Company Information */}
      <CompanyInfoCard
        formData={formData}
        errors={errors}
        onChange={onChange}
        onKeyDown={onKeyDown}
        companySuggestions={companySuggestions}
        showCompanySuggestions={showCompanySuggestions}
        highlightedIndex={highlightedIndex}
        listRef={listRef}
        companySuggestionRef={companySuggestionRef}
        onSelectCompany={onSelectCompany}
      />

      {/* AI Explanation */}
      <AIExplanationCard />

      {/* Contact Information and Address */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContactCard formData={formData} errors={errors} onChange={onChange} />

        <AddressCard
          formData={formData}
          onChange={onChange}
          isAutoFilling={isAutoFilling}
          autoFillSuccess={autoFillSuccess}
          autoFillError={autoFillError}
          currentStep={currentStep}
          onAutoFill={onAutoFill}
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          isSearchingZipcode={isSearchingZipcode}
          suggestionRef={suggestionRef}
          onSelectAddress={onSelectAddress}
        />
      </div>

      {/* Settings & Permissions and Additional Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SettingsCard formData={formData} onChange={onChange} onCheckboxChange={onCheckboxChange} />

        <AdditionalInfoCard formData={formData} onChange={onChange} />
      </div>
    </div>
  );
});
