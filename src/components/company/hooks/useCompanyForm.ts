import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { API, DEFAULT_VALUES } from '@/constants';
import { validateCompanyForm, validateField } from '@/lib/validators/companyValidator';
import { ThaiAddress } from '@/types/address';
import { Company, CompanyFormData } from '@/types/company';
import { useAddressAutocomplete } from './useAddressAutocomplete';
import { useFormPersistence } from './useFormPersistence';
import { FIELD_HANDLERS } from './useFieldHandlers';

const defaultFormData: CompanyFormData = {
  customerCode: '',
  nameTh: '',
  nameEn: '',
  taxId: '',
  branch: DEFAULT_VALUES.BRANCH,
  address: '',
  subDistrict: '',
  district: '',
  province: '',
  zipCode: '',
  phone: '',
  fax: '',
  email: '',
  isSignInvoice: false,
  isSignCustomsIn: false,
  isSignCustomsOut: false,
  usageType: DEFAULT_VALUES.USAGE_TYPE,
  goldCardNumber: '',
  brokerNumber: '',
  documentSenderNumber: '',
  boiRefNumber: '',
  aeoRefNumber: '',
  createdAt: '',
  updatedAt: '',
  createdBy: '',
  updatedBy: '',
};

export function useCompanyForm(initialData?: Company) {
  const initialFormData = useMemo(() => {
    if (initialData) {
      return { ...initialData, id: undefined } as CompanyFormData;
    }
    return undefined;
  }, [initialData]);

  const [formData, setFormData] = useState<CompanyFormData>(initialFormData ?? defaultFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const validationTimerRef = useRef<Record<string, NodeJS.Timeout>>({});
  const formDataRef = useRef<CompanyFormData>(formData);

  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  useEffect(() => {
    // เคลียร์ timeout ของ validation ทุกครั้งที่ unmount เพื่อกัน setState หลัง component หายไป
    return () => {
      Object.values(validationTimerRef.current).forEach(clearTimeout);
    };
  }, []);

  const {
    suggestions,
    showSuggestions,
    setShowSuggestions,
    isSearchingZipcode,
    searchAddress,
    selectAddress,
    clearSuggestions,
  } = useAddressAutocomplete();

  // Hooks สำหรับ address autocomplete และ form persistence
  const { clearDraft } = useFormPersistence(formData, setFormData, !!initialData);

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

        setErrors((prev) => {
          const newErrors = { ...prev };
          if (validation.error) {
            newErrors[fieldName] = validation.error;
          } else {
            delete newErrors[fieldName];
          }
          return newErrors;
        });

        delete validationTimerRef.current[fieldName];
      }, API.VALIDATION_DEBOUNCE);
    },
    []
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      const fieldName = name as keyof CompanyFormData;
      const fieldValue = type === 'checkbox' ? checked : value;

      if (type === 'checkbox') {
        setFormData((prev) => ({
          ...prev,
          [fieldName]: checked,
        }));
        return;
      }

      const handler = FIELD_HANDLERS[name];
      if (handler) {
        const result = handler(value);

        if (!result.isValid || result.shouldReturn) {
          return;
        }

        const finalValue = result.value ?? value;

        setFormData((prev) => ({
          ...prev,
          [fieldName]: finalValue,
        }));

        if (name === 'zipCode') {
          searchAddress(finalValue);
        }

        const updatedFormData = {
          ...formData,
          [fieldName]: finalValue,
        };
        validateSingleField(fieldName, finalValue, updatedFormData);
        return;
      }

      setFormData((prev) => ({
        ...prev,
        [fieldName]: fieldValue,
      }));

      const updatedFormData = {
        ...formData,
        [fieldName]: fieldValue,
      };
      validateSingleField(fieldName, fieldValue, updatedFormData);
    },
    [formData, setFormData, searchAddress, validateSingleField]
  );

  const handleSelectAddress = useCallback(
    (address: ThaiAddress) => {
      const selected = selectAddress(address);
      setFormData((prev) => ({
        ...prev,
        zipCode: selected.zipCode || prev.zipCode,
        subDistrict: selected.subDistrict,
        district: selected.district,
        province: selected.province,
      }));
    },
    [selectAddress, setFormData]
  );

  const validateForm = useCallback(() => {
    const validationResult = validateCompanyForm(formData);
    setErrors(validationResult.errors);
    return validationResult.isValid;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
    setErrors({});
    clearSuggestions();
    clearDraft();
  }, [clearSuggestions, clearDraft]);

  return {
    formData,
    setFormData,
    errors,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    isSearchingZipcode,
    handleChange,
    handleSelectAddress,
    validateForm,
    resetForm,
    clearDraft,
  };
}
