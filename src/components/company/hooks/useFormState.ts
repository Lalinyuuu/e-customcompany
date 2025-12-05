import { useState, useMemo } from 'react';
import { DEFAULT_VALUES } from '@/constants';
import { CompanyFormData } from '@/types/company';

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

export function useFormState(initialData?: CompanyFormData) {
  const startingData = useMemo(() => initialData ?? defaultFormData, [initialData]);

  const [formData, setFormData] = useState<CompanyFormData>(startingData);

  const resetForm = () => {
    setFormData(defaultFormData);
  };

  return {
    formData,
    setFormData,
    resetForm,
    initialFormData: defaultFormData,
  };
}
