import { useState, useRef, useCallback, useEffect } from 'react';
import { API } from '@/constants';
import {
  validateField,
  validateCompanyForm,
  validatePasswordConfirmation,
} from '@/lib/validators/companyValidator';
import { CompanyFormData } from '@/types/company';

export function useFormValidation(formData: CompanyFormData) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const validationTimerRef = useRef<Record<string, NodeJS.Timeout>>({});
  const formDataRef = useRef<CompanyFormData>(formData);

  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  const updateError = useCallback((fieldName: string, error: string | null) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[fieldName] = error;
      } else {
        delete newErrors[fieldName];
      }
      return newErrors;
    });
  }, []);

  const validatePasswordFields = useCallback(
    (password: string, confirmPassword: string) => {
      const validation = validatePasswordConfirmation(password, confirmPassword);
      updateError('importPermissionConfirmPassword', validation.error || null);
    },
    [updateError]
  );

  const validateSingleField = useCallback(
    (
      fieldName: keyof CompanyFormData,
      value: string | boolean,
      currentFormData: CompanyFormData
    ) => {
      if (validationTimerRef.current[fieldName]) {
        clearTimeout(validationTimerRef.current[fieldName]);
      }

      validationTimerRef.current[fieldName] = setTimeout(() => {
        const validation = validateField(
          fieldName,
          typeof value === 'string' ? value : '',
          currentFormData
        );

        updateError(fieldName, validation.error || null);

        if (
          fieldName === 'importPermissionPassword' &&
          currentFormData.importPermissionConfirmPassword
        ) {
          validatePasswordFields(
            typeof value === 'string' ? value : '',
            currentFormData.importPermissionConfirmPassword
          );
        } else if (
          fieldName === 'importPermissionConfirmPassword' &&
          currentFormData.importPermissionPassword
        ) {
          validatePasswordFields(
            currentFormData.importPermissionPassword,
            typeof value === 'string' ? value : ''
          );
        }

        delete validationTimerRef.current[fieldName];
      }, API.VALIDATION_DEBOUNCE);
    },
    [updateError, validatePasswordFields]
  );

  const validateForm = useCallback(() => {
    const validationResult = validateCompanyForm(formData);
    setErrors(validationResult.errors);
    return validationResult.isValid;
  }, [formData]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  return {
    errors,
    setErrors,
    validateSingleField,
    validateForm,
    clearErrors,
    clearFieldError,
  };
}
