type PhoneFormatConfig = {
  prefix: string | RegExp;
  format: (digits: string) => string;
};

function formatMobilePhone(digits: string): string {
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

function formatBangkokPhone(digits: string): string {
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  if (digits.length <= 9)
    return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5, 9)}`;
  return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5, 10)}`;
}

function formatProvincePhone(digits: string): string {
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 9)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

function formatDefaultPhone(digits: string): string {
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  if (digits.length <= 9)
    return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5, 9)}`;
  return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5, 10)}`;
}

const phoneFormatters: PhoneFormatConfig[] = [
  { prefix: /^(08|09)/, format: formatMobilePhone },
  { prefix: '02', format: formatBangkokPhone },
  { prefix: /^0[3457]/, format: formatProvincePhone },
];

export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '');

  if (!digits) return '';

  for (const config of phoneFormatters) {
    const prefix =
      typeof config.prefix === 'string'
        ? digits.startsWith(config.prefix)
        : config.prefix.test(digits);

    if (prefix) {
      return config.format(digits);
    }
  }

  return formatDefaultPhone(digits);
}

export function cleanPhoneNumber(value: string): string {
  return value.replace(/\D/g, '');
}

export function isValidPhoneFormat(value: string): boolean {
  const clean = cleanPhoneNumber(value);

  if (clean.length === 10 && (clean.startsWith('08') || clean.startsWith('09'))) {
    return true;
  }

  if ((clean.length === 9 || clean.length === 10) && clean.startsWith('02')) {
    return true;
  }

  if ((clean.length === 9 || clean.length === 10) && /^0[3457]/.test(clean)) {
    return true;
  }

  return false;
}
