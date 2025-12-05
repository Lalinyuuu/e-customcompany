'use client';

import { createContext, useContext, ReactNode } from 'react';
import { ThaiAddress } from '@/types/address';
import { CompanyFormData } from '@/types/company';

interface CompanyFormContextValue {
  formData: CompanyFormData;
  setFormData: React.Dispatch<React.SetStateAction<CompanyFormData>>;
  errors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
  handleSelectAddress: (address: ThaiAddress) => void;
  suggestions: ThaiAddress[];
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  isSearchingZipcode: boolean;
  isAutoFilling?: boolean;
  autoFillSuccess?: boolean;
  autoFillError?: string | null;
  currentStep?: 'analyzing' | 'searching' | 'filling' | null;
  onAutoFill?: () => void;
}

const CompanyFormContext = createContext<CompanyFormContextValue | undefined>(undefined);

export function useCompanyFormContext() {
  const context = useContext(CompanyFormContext);
  if (!context) {
    throw new Error('useCompanyFormContext must be used within CompanyFormProvider');
  }
  return context;
}

interface CompanyFormProviderProps {
  children: ReactNode;
  value: CompanyFormContextValue;
}

export function CompanyFormProvider({ children, value }: CompanyFormProviderProps) {
  return <CompanyFormContext.Provider value={value}>{children}</CompanyFormContext.Provider>;
}
