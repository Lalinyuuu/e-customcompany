import { Company } from '@/types/company';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateTaxId(taxId: string): { isValid: boolean; error?: string } {
  if (!taxId) {
    return { isValid: false, error: 'กรุณากรอกเลขประจำตัวผู้เสียภาษี' };
  }

  const cleanTaxId = taxId.replace(/\D/g, '');

  if (cleanTaxId.length !== 13) {
    return { isValid: false, error: 'เลขประจำตัวผู้เสียภาษีต้องมี 13 หลัก' };
  }

  const digits = cleanTaxId.split('').map(Number);
  let sum = 0;

  for (let i = 0; i < 12; i++) {
    const digit = digits[i];
    if (digit !== undefined) {
      sum += digit * (13 - i);
    }
  }

  const checkDigit = (11 - (sum % 11)) % 10;

  if (checkDigit !== digits[12]) {
    return { isValid: false, error: 'เลขประจำตัวผู้เสียภาษีไม่ถูกต้อง' };
  }

  return { isValid: true };
}

export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email) {
    return { isValid: true };
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'รูปแบบอีเมลไม่ถูกต้อง' };
  }

  return { isValid: true };
}

export function validatePhone(phone: string): { isValid: boolean; error?: string } {
  if (!phone) {
    return { isValid: false, error: 'กรุณากรอกเบอร์โทรศัพท์' };
  }

  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  const phoneRegex = /^(\+66|0)?[2-9]\d{7,8}$/;

  if (!phoneRegex.test(cleanPhone)) {
    return { isValid: false, error: 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง' };
  }

  return { isValid: true };
}

export function validateFax(fax: string): { isValid: boolean; error?: string } {
  if (!fax) {
    return { isValid: true };
  }

  const cleanFax = fax.replace(/[\s\-\(\)]/g, '');
  const faxRegex = /^(\+66|0)?[2-9]\d{7,8}$/;

  if (!faxRegex.test(cleanFax)) {
    return { isValid: false, error: 'รูปแบบเบอร์แฟกซ์ไม่ถูกต้อง' };
  }

  return { isValid: true };
}

export function validateCustomerCode(customerCode: string): { isValid: boolean; error?: string } {
  if (!customerCode) {
    return { isValid: false, error: 'กรุณากรอกรหัสลูกค้า' };
  }

  if (customerCode.length < 2) {
    return { isValid: false, error: 'รหัสลูกค้าต้องมีอย่างน้อย 2 ตัวอักษร' };
  }

  if (customerCode.length > 20) {
    return { isValid: false, error: 'รหัสลูกค้าไม่ควรเกิน 20 ตัวอักษร' };
  }

  return { isValid: true };
}

export function validateZipCode(zipCode: string): { isValid: boolean; error?: string } {
  if (!zipCode) {
    return { isValid: false, error: 'กรุณากรอกรหัสไปรษณีย์' };
  }

  const zipRegex = /^\d{5}$/;

  if (!zipRegex.test(zipCode)) {
    return { isValid: false, error: 'รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก' };
  }

  return { isValid: true };
}

export function validateCompanyName(
  name: string,
  fieldName: 'nameTh' | 'nameEn'
): { isValid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return {
      isValid: false,
      error: `กรุณากรอกชื่อบริษัท${fieldName === 'nameTh' ? ' (ไทย)' : ' (อังกฤษ)'}`,
    };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: 'ชื่อบริษัทต้องมีอย่างน้อย 2 ตัวอักษร' };
  }

  return { isValid: true };
}

export function validateAddress(address: string): { isValid: boolean; error?: string } {
  if (!address || address.trim().length === 0) {
    return { isValid: false, error: 'กรุณากรอกที่อยู่' };
  }

  if (address.trim().length < 5) {
    return { isValid: false, error: 'ที่อยู่ต้องมีอย่างน้อย 5 ตัวอักษร' };
  }

  return { isValid: true };
}

export function validatePasswordConfirmation(
  password: string,
  confirmPassword: string
): { isValid: boolean; error?: string } {
  if (!password && !confirmPassword) {
    return { isValid: true };
  }

  if (password && !confirmPassword) {
    return { isValid: false, error: 'กรุณายืนยันรหัสผ่าน' };
  }

  if (!password && confirmPassword) {
    return { isValid: false, error: 'กรุณากรอกรหัสผ่าน' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'รหัสผ่านไม่ตรงกัน' };
  }

  return { isValid: true };
}

type FieldValidator = (
  value: string,
  formData?: Omit<Company, 'id'>
) => { isValid: boolean; error?: string };

function validateRequiredField(
  fieldName: string,
  value: string,
  validator: FieldValidator,
  formData?: Omit<Company, 'id'>
): string | undefined {
  const result = validator(value, formData);
  return result.isValid ? undefined : result.error;
}

function validateOptionalField(
  fieldName: string,
  value: string,
  validator: FieldValidator,
  formData?: Omit<Company, 'id'>
): string | undefined {
  if (!value) {
    return undefined;
  }
  const result = validator(value, formData);
  return result.isValid ? undefined : result.error;
}

function validateRequiredFields(
  formData: Omit<Company, 'id'>,
  fieldConfigs: Array<[string, string, FieldValidator]>
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const [fieldName, value, validator] of fieldConfigs) {
    const error = validateRequiredField(fieldName, value, validator, formData);
    if (error) {
      errors[fieldName] = error;
    }
  }

  return errors;
}

function validateOptionalFields(
  formData: Omit<Company, 'id'>,
  fieldConfigs: Array<[string, string, FieldValidator]>
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const [fieldName, value, validator] of fieldConfigs) {
    const error = validateOptionalField(fieldName, value, validator, formData);
    if (error) {
      errors[fieldName] = error;
    }
  }

  return errors;
}

function validatePasswordFields(formData: Omit<Company, 'id'>): Record<string, string> {
  const errors: Record<string, string> = {};

  if (formData['importPermissionPassword'] || formData['importPermissionConfirmPassword']) {
    const passwordError = validateRequiredField(
      'importPermissionConfirmPassword',
      formData['importPermissionConfirmPassword'] || '',
      () =>
        validatePasswordConfirmation(
          formData['importPermissionPassword'] || '',
          formData['importPermissionConfirmPassword'] || ''
        ),
      formData
    );
    if (passwordError) {
      errors['importPermissionConfirmPassword'] = passwordError;
    }
  }

  return errors;
}

function validateRbsMail(formData: Omit<Company, 'id'>): Record<string, string> {
  const errors: Record<string, string> = {};

  if (formData['rbsMail']) {
    const rbsMailError = validateOptionalField(
      'rbsMail',
      formData['rbsMail'],
      validateEmail,
      formData
    );
    if (rbsMailError) {
      errors['rbsMail'] = rbsMailError;
    }
  }

  return errors;
}

export function validateCompanyForm(formData: Omit<Company, 'id'>): ValidationResult {
  const requiredFieldConfigs: Array<[string, string, FieldValidator]> = [
    ['nameTh', formData['nameTh'] || '', (v) => validateCompanyName(v, 'nameTh')],
    ['nameEn', formData['nameEn'] || '', (v) => validateCompanyName(v, 'nameEn')],
    ['taxId', formData['taxId'] || '', validateTaxId],
    ['customerCode', formData['customerCode'] || '', validateCustomerCode],
    ['address', formData['address'] || '', validateAddress],
    ['zipCode', formData['zipCode'] || '', validateZipCode],
    ['phone', formData['phone'] || '', validatePhone],
  ];

  const optionalFieldConfigs: Array<[string, string, FieldValidator]> = [
    ['email', formData['email'] || '', validateEmail],
    ['fax', formData['fax'] || '', validateFax],
  ];

  const errors = {
    ...validateRequiredFields(formData, requiredFieldConfigs),
    ...validateOptionalFields(formData, optionalFieldConfigs),
    ...validatePasswordFields(formData),
    ...validateRbsMail(formData),
  };

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

type FieldValidatorMap = Record<string, FieldValidator>;

const fieldValidators: FieldValidatorMap = {
  taxId: validateTaxId,
  email: validateEmail,
  phone: validatePhone,
  fax: validateFax,
  customerCode: validateCustomerCode,
  zipCode: validateZipCode,
  nameTh: (v) => validateCompanyName(v, 'nameTh'),
  nameEn: (v) => validateCompanyName(v, 'nameEn'),
  address: validateAddress,
  rbsMail: validateEmail,
};

function validatePasswordField(
  fieldName: 'importPermissionPassword' | 'importPermissionConfirmPassword',
  value: string,
  formData?: Omit<Company, 'id'>
): { isValid: boolean; error?: string } {
  if (fieldName === 'importPermissionPassword' && formData?.importPermissionConfirmPassword) {
    return validatePasswordConfirmation(value, formData.importPermissionConfirmPassword);
  }
  if (fieldName === 'importPermissionConfirmPassword' && formData?.importPermissionPassword) {
    return validatePasswordConfirmation(formData.importPermissionPassword, value);
  }
  return { isValid: true };
}

export function validateField(
  fieldName: keyof Omit<Company, 'id'>,
  value: string,
  formData?: Omit<Company, 'id'>
): { isValid: boolean; error?: string } {
  if (fieldName === 'importPermissionPassword' || fieldName === 'importPermissionConfirmPassword') {
    return validatePasswordField(fieldName, value, formData);
  }

  const validator = fieldValidators[fieldName];
  if (validator) {
    return validator(value, formData);
  }

  return { isValid: true };
}
