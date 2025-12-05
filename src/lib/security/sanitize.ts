export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/\0/g, '')
    .replace(/[\x01-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
    .trim();
}

export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  // ป้องกัน payload ง่าย ๆ เช่น <script>, on* attribute, และ javascript: scheme ก่อน escape
  const stripped = input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/javascript:/gi, '');

  return stripped
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') {
    return '';
  }

  const sanitized = sanitizeString(email.toLowerCase().trim());
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(sanitized)) {
    return '';
  }

  return sanitized;
}

export function sanitizeNumber(input: string | number): string {
  if (typeof input === 'number') {
    return String(input);
  }

  if (typeof input !== 'string') {
    return '';
  }

  return input.replace(/\D/g, '');
}

export function sanitizePhone(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input.replace(/[^\d\s\-\(\)]/g, '');
}

export function sanitizeObject<ObjectType extends Record<string, unknown>>(
  obj: ObjectType
): ObjectType {
  const sanitized = { ...obj };

  for (const key in sanitized) {
    const value = sanitized[key];
    type KeyType = Extract<keyof ObjectType, string>;

    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value) as ObjectType[KeyType];
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>) as ObjectType[KeyType];
    } else if (Array.isArray(value)) {
      sanitized[key] = (value as unknown[]).map((arrayItem) =>
        typeof arrayItem === 'string' ? sanitizeString(arrayItem) : arrayItem
      ) as ObjectType[KeyType];
    }
  }

  return sanitized;
}
