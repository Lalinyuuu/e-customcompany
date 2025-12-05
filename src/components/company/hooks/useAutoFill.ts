import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { logger } from '@/lib/logger';
import { AIService } from '@/services/companyService';
import { CompanyFormData } from '@/types/company';

export function useAutoFill(
  formData: CompanyFormData,
  setFormData: React.Dispatch<React.SetStateAction<CompanyFormData>>
) {
  const t = useTranslations('CompanyForm');
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [autoFillSuccess, setAutoFillSuccess] = useState(false);
  const [autoFillError, setAutoFillError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'analyzing' | 'searching' | 'filling' | null>(
    null
  );

  const handleAutoFill = async () => {
    const companyName = formData.nameTh || formData.nameEn;

    if (!companyName) {
      setAutoFillError(t('auto_fill_no_name'));
      setTimeout(() => setAutoFillError(null), 3000);
      return;
    }

    setIsAutoFilling(true);
    setAutoFillSuccess(false);
    setAutoFillError(null);

    setCurrentStep('analyzing');
    await new Promise((resolve) => setTimeout(resolve, 500));

    setCurrentStep('searching');
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const data = await AIService.generateAddress(companyName);

      setCurrentStep('filling');
      await new Promise((resolve) => setTimeout(resolve, 300));

      setFormData((prev) => ({
        ...prev,
        nameTh: data.nameTh || prev.nameTh,
        nameEn: data.nameEn || prev.nameEn,
        address: data.address,
        addressEn: data.addressEn || prev.addressEn,
        subDistrict: data.subDistrict,
        district: data.district,
        province: data.province,
        zipCode: data.zipCode,
      }));

      setAutoFillSuccess(true);
      setTimeout(() => setAutoFillSuccess(false), 3000);
    } catch (error) {
      logger.error('Auto-fill error', error instanceof Error ? error : new Error(String(error)));
      setAutoFillError(error instanceof Error ? error.message : t('auto_fill_error'));
      setTimeout(() => setAutoFillError(null), 5000);
    } finally {
      setIsAutoFilling(false);
      setCurrentStep(null);
    }
  };

  return {
    isAutoFilling,
    autoFillSuccess,
    autoFillError,
    currentStep,
    handleAutoFill,
  };
}
