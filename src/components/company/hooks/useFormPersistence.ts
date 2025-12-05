import { useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '@/constants';
import { logger } from '@/lib/logger';
import { StorageService } from '@/lib/storage/StorageService';
import { CompanyFormData } from '@/types/company';

export function useFormPersistence(
  formData: CompanyFormData,
  setFormData: React.Dispatch<React.SetStateAction<CompanyFormData>>,
  isEditMode: boolean
) {
  useEffect(() => {
    if (isEditMode) {
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    const shouldClearDraft = sessionStorage.getItem(STORAGE_KEYS.CLEAR_DRAFT_ON_MOUNT);
    if (shouldClearDraft) {
      StorageService.clearDraft(STORAGE_KEYS.COMPANY_FORM_DRAFT);
      sessionStorage.removeItem(STORAGE_KEYS.CLEAR_DRAFT_ON_MOUNT);
      return;
    }

    const savedDraft = StorageService.loadDraft<CompanyFormData>(STORAGE_KEYS.COMPANY_FORM_DRAFT);
    if (savedDraft) {
      setFormData((prev) => ({ ...prev, ...savedDraft }));
      logger.debug('[useFormPersistence] Restored draft from localStorage');
    }
  }, [isEditMode, setFormData]);

  useEffect(() => {
    if (isEditMode) {
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    const timeoutId = setTimeout(() => {
      StorageService.saveDraft(STORAGE_KEYS.COMPANY_FORM_DRAFT, formData);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData, isEditMode]);

  const clearDraft = useCallback(() => {
    if (typeof window !== 'undefined') {
      StorageService.clearDraft(STORAGE_KEYS.COMPANY_FORM_DRAFT);
      logger.debug('[useFormPersistence] Cleared draft');
    }
  }, []);

  return {
    clearDraft,
  };
}
