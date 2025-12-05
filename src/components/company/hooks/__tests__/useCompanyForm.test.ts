import { act, renderHook, waitFor } from '@testing-library/react';
import apiClient from '@/lib/api/axiosInstance';
import { Company } from '@/types/company';
import { useCompanyForm } from '../useCompanyForm';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock axios instance
jest.mock('@/lib/api/axiosInstance', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('useCompanyForm', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should initialize with default form data', () => {
    const { result } = renderHook(() => useCompanyForm());

    expect(result.current.formData.customerCode).toBe('');
    expect(result.current.formData.nameTh).toBe('');
    expect(result.current.formData.branch).toBe('0000');
  });

  it('should initialize with provided initial data', () => {
    const initialData: Company = {
      id: '1',
      customerCode: 'CUST001',
      nameTh: 'บริษัททดสอบ',
      nameEn: 'Test Company',
      taxId: '1234567890121',
      branch: '0000',
      address: '123 ถนนสุขุมวิท',
      subDistrict: 'คลองเตย',
      district: 'คลองเตย',
      province: 'กรุงเทพมหานคร',
      zipCode: '10110',
      phone: '0812345678',
      fax: '021234567',
      email: 'test@example.com',
      isSignInvoice: false,
      isSignCustomsIn: false,
      isSignCustomsOut: false,
      usageType: 'GENERAL',
      goldCardNumber: '',
      brokerNumber: '',
      documentSenderNumber: '',
      boiRefNumber: '',
      aeoRefNumber: '',
    };

    const { result } = renderHook(() => useCompanyForm(initialData));

    expect(result.current.formData.customerCode).toBe('CUST001');
    expect(result.current.formData.nameTh).toBe('บริษัททดสอบ');
  });

  it('should update form data on change', () => {
    const { result } = renderHook(() => useCompanyForm());

    act(() => {
      const event = {
        target: {
          name: 'customerCode',
          value: 'CUST001',
          type: 'text',
        },
      } as React.ChangeEvent<HTMLInputElement>;

      result.current.handleChange(event);
    });

    expect(result.current.formData.customerCode).toBe('CUST001');
  });

  it('should restrict taxId to numbers only', () => {
    const { result } = renderHook(() => useCompanyForm());

    // First set valid value
    act(() => {
      const event = {
        target: {
          name: 'taxId',
          value: '123',
          type: 'text',
        },
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleChange(event);
    });
    expect(result.current.formData.taxId).toBe('123');

    // Try to set invalid value (should be ignored)
    act(() => {
      const event = {
        target: {
          name: 'taxId',
          value: '123abc',
          type: 'text',
        },
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleChange(event);
    });

    expect(result.current.formData.taxId).toBe('123');
  });

  it('should limit taxId to 13 digits', () => {
    const { result } = renderHook(() => useCompanyForm());

    act(() => {
      const event = {
        target: {
          name: 'taxId',
          value: '12345678901234',
          type: 'text',
        },
      } as React.ChangeEvent<HTMLInputElement>;

      result.current.handleChange(event);
    });

    expect(result.current.formData.taxId.length).toBeLessThanOrEqual(13);
  });

  it('should handle zipCode search with debounce', async () => {
    const mockAddresses = [
      {
        subDistrict: 'คลองเตย',
        district: 'คลองเตย',
        province: 'กรุงเทพมหานคร',
        zipCode: '10110',
      },
    ];

    mockedApiClient.get.mockResolvedValueOnce({
      data: { addresses: mockAddresses },
      status: 200,
    });

    const { result } = renderHook(() => useCompanyForm());

    act(() => {
      const event = {
        target: {
          name: 'zipCode',
          value: '101',
          type: 'text',
        },
      } as React.ChangeEvent<HTMLInputElement>;

      result.current.handleChange(event);
    });

    // Fast-forward timers to trigger debounce
    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(mockedApiClient.get).toHaveBeenCalled();
    });
  });

  it('should reset form data', () => {
    const { result } = renderHook(() => useCompanyForm());

    act(() => {
      const event = {
        target: {
          name: 'customerCode',
          value: 'CUST001',
          type: 'text',
        },
      } as React.ChangeEvent<HTMLInputElement>;

      result.current.handleChange(event);
    });

    expect(result.current.formData.customerCode).toBe('CUST001');

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.formData.customerCode).toBe('');
  });

  it('should validate form and return errors', async () => {
    const { result } = renderHook(() => useCompanyForm());

    let isValid: boolean = false;
    act(() => {
      isValid = result.current.validateForm();
    });

    expect(isValid).toBe(false);

    // Wait for state update
    await waitFor(() => {
      expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
    });
  });

  it('should handle address selection', () => {
    const { result } = renderHook(() => useCompanyForm());

    const address = {
      subDistrict: 'คลองเตย',
      district: 'คลองเตย',
      province: 'กรุงเทพมหานคร',
      zipCode: '10110',
    };

    act(() => {
      result.current.handleSelectAddress(address);
    });

    expect(result.current.formData.subDistrict).toBe('คลองเตย');
    expect(result.current.formData.district).toBe('คลองเตย');
    expect(result.current.formData.province).toBe('กรุงเทพมหานคร');
    expect(result.current.formData.zipCode).toBe('10110');
    expect(result.current.showSuggestions).toBe(false);
  });
});
