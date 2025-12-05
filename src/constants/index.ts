// Form validation constants
export const VALIDATION = {
  TAX_ID_LENGTH: 13,
  MIN_CUSTOMER_CODE_LENGTH: 2,
  MAX_CUSTOMER_CODE_LENGTH: 20,
  MIN_COMPANY_NAME_LENGTH: 2,
  MIN_ADDRESS_LENGTH: 5,
  ZIP_CODE_LENGTH: 5,
  PHONE_MAX_LENGTH: 12,
  MIN_ZIPCODE_SEARCH_LENGTH: 2,
} as const;

// Storage keys
export const STORAGE_KEYS = {
  COMPANY_FORM_DRAFT: 'company-form-draft',
  CLEAR_DRAFT_ON_MOUNT: 'clear-draft-on-mount',
} as const;

// API constants
export const API = {
  DEBOUNCE_DELAY: 300,
  VALIDATION_DEBOUNCE: 500,
  MAX_ADDRESS_SUGGESTIONS: 50,
  ZIPCODE_DEBOUNCE: 300,
  COMPANY_SEARCH_MIN_LENGTH: 2,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_ITEMS_PER_PAGE: 10,
  MAX_PAGINATION_BUTTONS: 5,
} as const;

// Company usage types
export const USAGE_TYPES = {
  GENERAL: 'GENERAL',
  GOLD_CARD: 'GOLD_CARD',
  BROKER: 'BROKER',
} as const;

// Default form values
export const DEFAULT_VALUES = {
  BRANCH: '0000',
  USAGE_TYPE: USAGE_TYPES.GENERAL,
} as const;

// API Routes
export const API_ROUTES = {
  COMPANIES: '/api/companies',
  COMPANIES_EXPORT: '/api/companies/export',
  COMPANY_BY_ID: (id: string) => `/api/companies/${id}`,
  THAI_ADDRESS: '/api/thai-address',
  AI_ADDRESS: '/api/ai-address',
} as const;

// Query Keys for React Query
export const QUERY_KEYS = {
  COMPANIES: ['companies'] as const,
  COMPANY: (id: string) => ['company', id] as const,
  COMPANY_SEARCH: (query: string) => ['companies', 'search', query] as const,
  THAI_ADDRESS: (zipcode: string) => ['thai-address', zipcode] as const,
} as const;
