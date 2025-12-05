/**
 * Validation constants for form fields
 * ใช้ constants แทน magic numbers เพื่อให้โค้ดอ่านง่ายและ maintain ง่าย
 */

// Field length limits
export const MAX_TAX_ID_LENGTH = 13;
export const MAX_ZIPCODE_LENGTH = 5;

// Validation patterns
export const VALIDATION_PATTERNS = {
  /** อนุญาตเฉพาะตัวเลข */
  NUMBERS_ONLY: /^\d*$/,
  /** อนุญาตตัวเลข, ช่องว่าง, และขีด (สำหรับเบอร์โทร) */
  PHONE_FORMAT: /^[\d\s\-]*$/,
} as const;
