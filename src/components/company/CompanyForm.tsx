'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent } from '@/components/ui/Tabs';
import { useRouter } from '@/i18n/routing';
import { logger } from '@/lib/logger';
import { Company } from '@/types/company';
import { FormAuditTrail } from './form/FormAuditTrail';
import { FormHeader } from './form/FormHeader';
import { FormMainContent } from './form/FormMainContent';
import { FormTabsNavigation } from './form/FormTabsNavigation';
import { useAutoFill } from './hooks/useAutoFill';
import { useCompanyForm } from './hooks/useCompanyForm';
import { useCompanySearch } from './hooks/useCompanySearch';
import { OtherInfoCard } from './cards/OtherInfoCard';

interface CompanyFormProps {
  initialData?: Company;
  onSubmit: (data: Omit<Company, 'id'>) => Promise<void>;
  isEdit?: boolean;
}

export function CompanyForm({ initialData, onSubmit, isEdit = false }: CompanyFormProps) {
  const t = useTranslations('CompanyForm');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  const {
    formData,
    setFormData,
    errors,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    isSearchingZipcode,
    handleChange: baseHandleChange,
    handleSelectAddress,
    validateForm,
    resetForm,
    clearDraft,
  } = useCompanyForm(initialData);

  const { isAutoFilling, autoFillSuccess, autoFillError, currentStep, handleAutoFill } =
    useAutoFill(formData, setFormData);

  const {
    companySuggestions,
    showCompanySuggestions,
    setShowCompanySuggestions,
    highlightedIndex,
    companySuggestionRef,
    listRef,
    handleKeyDown,
    handleNameChange,
    handleSelectCompany,
  } = useCompanySearch(formData, setFormData, resetForm);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (
        companySuggestionRef.current &&
        !companySuggestionRef.current.contains(event.target as Node)
      ) {
        setShowCompanySuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowSuggestions, setShowCompanySuggestions, companySuggestionRef]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      if (name === 'nameTh' || name === 'nameEn') {
        handleNameChange(name, value);
      }

      baseHandleChange(e);
    },
    [handleNameChange, baseHandleChange]
  );

  const handleCheckboxChange = useCallback(
    (name: string, checked: boolean) => {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    },
    [setFormData]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t('validation_error'), {
        description: t('validation_error_desc'),
      });
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      clearDraft();
      toast.success(isEdit ? t('submit_success_edit') : t('submit_success_create'), {
        description: isEdit ? t('submit_success_edit_desc') : t('submit_success_create_desc'),
      });
      router.push('/companies');
      router.refresh();
    } catch (error) {
      logger.error(
        'Error submitting form',
        error instanceof Error ? error : new Error(String(error))
      );
      toast.error(t('submit_error'), {
        description: error instanceof Error ? error.message : t('submit_error_desc'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-8">
      <FormHeader isEdit={isEdit} loading={loading} />

      {/* Tabs Navigation */}
      <Tabs defaultValue="main" className="w-full">
        <FormTabsNavigation />

        {/* Tab Content: All Information */}
        <TabsContent value="main" className="space-y-6 mt-0">
          <FormMainContent
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onCheckboxChange={handleCheckboxChange}
            onKeyDown={handleKeyDown}
            companySuggestions={companySuggestions}
            showCompanySuggestions={showCompanySuggestions}
            highlightedIndex={highlightedIndex}
            listRef={listRef}
            companySuggestionRef={companySuggestionRef}
            onSelectCompany={handleSelectCompany}
            isAutoFilling={isAutoFilling}
            autoFillSuccess={autoFillSuccess}
            autoFillError={autoFillError}
            currentStep={currentStep}
            onAutoFill={handleAutoFill}
            suggestions={suggestions}
            showSuggestions={showSuggestions}
            isSearchingZipcode={isSearchingZipcode}
            suggestionRef={suggestionRef}
            onSelectAddress={handleSelectAddress}
          />
        </TabsContent>

        {/* Tab Content: Other Information */}
        <TabsContent value="other" className="space-y-6 mt-0">
          <OtherInfoCard
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onCheckboxChange={handleCheckboxChange}
          />
        </TabsContent>
      </Tabs>

      {/* Audit Trail */}
      {isEdit && <FormAuditTrail formData={formData} />}

      {/* Mobile Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border flex gap-3 md:hidden z-50">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/companies')}
          disabled={loading}
          className="flex-1 h-12"
        >
          {t('cancel')}
        </Button>
        <Button type="submit" disabled={loading} className="flex-1 h-12">
          {loading ? t('saving') : isEdit ? t('save_edit') : t('save_create')}
        </Button>
      </div>
    </form>
  );
}
