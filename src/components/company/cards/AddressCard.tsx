'use client';

import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { ThaiAddress } from '@/types/address';
import { Company } from '@/types/company';
import { AddressCardHeader } from '../sections/AddressCardHeader';
import {
  AddressInputFields,
  AddressLocationFields,
  AutoFillStatus,
  ZipCodeField,
} from '../sections/AddressCardSections';

interface AddressCardProps {
  formData: Omit<Company, 'id'>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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

export const AddressCard = memo(function AddressCard({
  formData,
  onChange,
  isAutoFilling,
  autoFillSuccess,
  autoFillError,
  currentStep,
  onAutoFill,
  suggestions,
  showSuggestions,
  isSearchingZipcode = false,
  suggestionRef,
  onSelectAddress,
}: AddressCardProps) {
  return (
    <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200">
      <AddressCardHeader
        formData={formData}
        isAutoFilling={isAutoFilling}
        onAutoFill={onAutoFill}
      />
      <CardContent className="pt-6 grid gap-6">
        <AutoFillStatus
          isAutoFilling={isAutoFilling}
          autoFillSuccess={autoFillSuccess}
          autoFillError={autoFillError}
          currentStep={currentStep}
        />
        <AddressInputFields formData={formData} onChange={onChange} isAutoFilling={isAutoFilling} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ZipCodeField
            formData={formData}
            onChange={onChange}
            isAutoFilling={isAutoFilling}
            isSearchingZipcode={isSearchingZipcode}
            suggestions={suggestions}
            showSuggestions={showSuggestions}
            suggestionRef={suggestionRef}
            onSelectAddress={onSelectAddress}
          />
          <AddressLocationFields
            formData={formData}
            onChange={onChange}
            isAutoFilling={isAutoFilling}
          />
        </div>
      </CardContent>
    </Card>
  );
});
