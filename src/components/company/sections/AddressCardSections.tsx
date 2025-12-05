'use client';

import { Brain, CheckCircle2, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/Input';
import { ThaiAddress } from '@/types/address';
import { Company } from '@/types/company';

interface AutoFillStatusProps {
  isAutoFilling: boolean;
  autoFillSuccess: boolean;
  autoFillError: string | null;
  currentStep?: 'analyzing' | 'searching' | 'filling' | null;
}

export function AutoFillStatus({
  isAutoFilling,
  autoFillSuccess,
  autoFillError,
  currentStep,
}: AutoFillStatusProps) {
  const t = useTranslations('CompanyForm');

  if (isAutoFilling) {
    return (
      <div className="relative overflow-hidden p-5 bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20 border-2 border-purple-200/50 dark:border-purple-800/50 rounded-xl shadow-lg">
        <div className="absolute inset-0 bg-linear-to-r from-purple-500/10 via-blue-500/10 to-indigo-500/10 animate-shimmer" />
        <div className="relative flex items-start gap-4">
          <div className="shrink-0 mt-1">
            <div className="relative">
              <div className="w-10 h-10 border-[3px] border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin" />
              <Brain className="absolute inset-0 m-auto h-5 w-5 text-purple-600 dark:text-purple-400 animate-pulse" />
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-sm font-semibold text-purple-900 dark:text-purple-100 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                  {t('ai_processing') || 'AI Processing'}
                </span>
                {t('auto_fill_searching')}
              </p>
              <p className="text-xs text-purple-700/80 dark:text-purple-300/80 mt-1">
                {t('auto_fill_searching_desc')}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <div className="flex-1 h-1.5 bg-purple-200 dark:bg-purple-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-linear-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500 ${
                      currentStep === 'analyzing'
                        ? 'w-1/3'
                        : currentStep === 'searching'
                          ? 'w-2/3'
                          : currentStep === 'filling'
                            ? 'w-full'
                            : 'w-0'
                    }`}
                  />
                </div>
                <span className="text-purple-600 dark:text-purple-400 font-medium min-w-[100px]">
                  {currentStep === 'analyzing' && (t('ai_step_analyzing') || 'Analyzing...')}
                  {currentStep === 'searching' && (t('ai_step_searching') || 'Searching...')}
                  {currentStep === 'filling' && (t('ai_step_filling') || 'Filling...')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (autoFillSuccess) {
    return (
      <div className="flex items-center gap-3 p-4 bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800 rounded-xl shadow-sm animate-in slide-in-from-top-2 duration-300">
        <div className="shrink-0">
          <div className="relative">
            <CheckCircle2 className="w-7 h-7 text-green-600 dark:text-green-400" />
            <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-green-800 dark:text-green-200 flex items-center gap-2">
            {t('auto_fill_success')}
            <span className="text-xs font-normal text-green-600 dark:text-green-400">
              ({t('ai_completed') || 'AI Completed'})
            </span>
          </p>
          <p className="text-xs text-green-700/80 dark:text-green-300/80 mt-0.5">
            {t('auto_fill_success_desc')}
          </p>
        </div>
      </div>
    );
  }

  if (autoFillError) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg animate-in slide-in-from-top-2 duration-300">
        <div className="shrink-0">
          <svg
            className="w-6 h-6 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-red-800 dark:text-red-300">
            {t('auto_fill_error')}
          </p>
          <p className="text-xs text-red-600 dark:text-red-400">{autoFillError}</p>
        </div>
      </div>
    );
  }

  return null;
}

interface AddressInputFieldsProps {
  formData: Omit<Company, 'id'>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAutoFilling: boolean;
}

export function AddressInputFields({ formData, onChange, isAutoFilling }: AddressInputFieldsProps) {
  const t = useTranslations('CompanyForm');
  const disabledClass = isAutoFilling ? 'opacity-60' : '';

  return (
    <>
      <div className="space-y-2">
        <label htmlFor="address" className="text-sm font-medium text-foreground">
          {t('address_no')}
        </label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={onChange}
          required
          placeholder={t('placeholders.address')}
          className={disabledClass}
          disabled={isAutoFilling}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="addressEn" className="text-sm font-medium text-foreground">
          {t('address_en')}
        </label>
        <Input
          id="addressEn"
          name="addressEn"
          value={formData.addressEn || ''}
          onChange={onChange}
          placeholder={t('placeholders.address_en')}
          className={disabledClass}
          disabled={isAutoFilling}
        />
      </div>
    </>
  );
}

interface AddressSuggestionsProps {
  suggestions: ThaiAddress[];
  showSuggestions: boolean;
  onSelectAddress: (address: ThaiAddress) => void;
}

export function AddressSuggestions({
  suggestions,
  showSuggestions,
  onSelectAddress,
}: AddressSuggestionsProps) {
  if (!showSuggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute z-50 w-full mt-1 bg-popover text-popover-foreground border rounded-md shadow-lg max-h-60 overflow-auto">
      <ul className="py-1">
        {suggestions.map((addr) => {
          const uniqueKey = `${addr.subDistrict}-${addr.district}-${addr.province}-${addr.zipCode || ''}`;
          return (
            <li
              key={uniqueKey}
              className="px-3 py-2 text-sm hover:bg-muted cursor-pointer transition-colors"
              onClick={() => onSelectAddress(addr)}
            >
              <div className="flex items-center justify-between">
                <span>
                  {addr.subDistrict} &gt; {addr.district} &gt; {addr.province}
                </span>
                {addr.zipCode && (
                  <span className="ml-2 text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {addr.zipCode}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

interface ZipCodeFieldProps {
  formData: Omit<Company, 'id'>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAutoFilling: boolean;
  isSearchingZipcode: boolean;
  suggestions: ThaiAddress[];
  showSuggestions: boolean;
  suggestionRef: React.RefObject<HTMLDivElement | null>;
  onSelectAddress: (address: ThaiAddress) => void;
}

export function ZipCodeField({
  formData,
  onChange,
  isAutoFilling,
  isSearchingZipcode,
  suggestions,
  showSuggestions,
  suggestionRef,
  onSelectAddress,
}: ZipCodeFieldProps) {
  const t = useTranslations('CompanyForm');

  return (
    <div className="space-y-2 relative" ref={suggestionRef}>
      <label
        htmlFor="zipCode"
        className="text-sm font-medium text-foreground flex items-center gap-2"
      >
        {t('zip_code')}
        {isSearchingZipcode && (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
        )}
      </label>
      <div className="relative">
        <Input
          id="zipCode"
          name="zipCode"
          value={formData.zipCode}
          onChange={onChange}
          placeholder={t('placeholders.zip_code')}
          autoComplete="off"
          className={isAutoFilling ? 'opacity-60' : ''}
          disabled={isAutoFilling}
        />
        {isSearchingZipcode && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
      <AddressSuggestions
        suggestions={suggestions}
        showSuggestions={showSuggestions}
        onSelectAddress={onSelectAddress}
      />
    </div>
  );
}

interface AddressLocationFieldsProps {
  formData: Omit<Company, 'id'>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAutoFilling: boolean;
}

export function AddressLocationFields({
  formData,
  onChange,
  isAutoFilling,
}: AddressLocationFieldsProps) {
  const t = useTranslations('CompanyForm');
  const disabledClass = isAutoFilling ? 'opacity-60' : '';

  return (
    <>
      <div className="space-y-2">
        <label htmlFor="subDistrict" className="text-sm font-medium text-foreground">
          {t('sub_district')}
        </label>
        <Input
          id="subDistrict"
          name="subDistrict"
          value={formData.subDistrict}
          onChange={onChange}
          placeholder={t('placeholders.sub_district')}
          className={disabledClass}
          disabled={isAutoFilling}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="district" className="text-sm font-medium text-foreground">
          {t('district')}
        </label>
        <Input
          id="district"
          name="district"
          value={formData.district}
          onChange={onChange}
          placeholder={t('placeholders.district')}
          className={disabledClass}
          disabled={isAutoFilling}
        />
      </div>
      <div className="space-y-2 sm:col-span-2 lg:col-span-1">
        <label htmlFor="province" className="text-sm font-medium text-foreground">
          {t('province')}
        </label>
        <Input
          id="province"
          name="province"
          value={formData.province}
          onChange={onChange}
          placeholder={t('placeholders.province')}
          className={disabledClass}
          disabled={isAutoFilling}
        />
      </div>
    </>
  );
}
