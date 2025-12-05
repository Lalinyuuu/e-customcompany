import { MAX_TAX_ID_LENGTH, MAX_ZIPCODE_LENGTH, VALIDATION_PATTERNS } from '@/constants/validation';
import { formatPhoneNumber } from '@/lib/utils/phoneFormatter';

interface FieldHandlerResult {
  isValid: boolean;
  value?: string;
  shouldReturn?: boolean;
}

export function handleTaxIdField(value: string): FieldHandlerResult {
  if (!VALIDATION_PATTERNS.NUMBERS_ONLY.test(value)) {
    return { isValid: false, shouldReturn: true };
  }

  if (value.length > MAX_TAX_ID_LENGTH) {
    return { isValid: false, shouldReturn: true };
  }

  return { isValid: true, value };
}

export function handlePhoneField(value: string): FieldHandlerResult {
  if (!VALIDATION_PATTERNS.PHONE_FORMAT.test(value)) {
    return { isValid: false, shouldReturn: true };
  }

  const formatted = formatPhoneNumber(value);

  return { isValid: true, value: formatted };
}

export function handleZipCodeField(value: string): FieldHandlerResult {
  if (!VALIDATION_PATTERNS.NUMBERS_ONLY.test(value)) {
    return { isValid: false, shouldReturn: true };
  }

  if (value.length > MAX_ZIPCODE_LENGTH) {
    return { isValid: false, shouldReturn: true };
  }

  return { isValid: true, value };
}

export const FIELD_HANDLERS: Record<string, (value: string) => FieldHandlerResult> = {
  taxId: handleTaxIdField,
  phone: handlePhoneField,
  fax: handlePhoneField,
  zipCode: handleZipCodeField,
};
