import { Company } from '@/types/company';
import { CompanyService, AddressService } from '../companyService';
import apiClient from '@/lib/api/axiosInstance';

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

describe('CompanyService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCompanies', () => {
    it('should fetch all companies', async () => {
      const mockCompanies: Company[] = [
        { id: '1', nameTh: 'Company 1', taxId: '1234567890123' } as Company,
        { id: '2', nameTh: 'Company 2', taxId: '9876543210987' } as Company,
      ];

      mockedApiClient.get.mockResolvedValueOnce({ data: mockCompanies });

      const result = await CompanyService.getAllCompanies();
      expect(result).toEqual(mockCompanies);
      expect(mockedApiClient.get).toHaveBeenCalledWith('/api/companies');
    });

    it('should fetch companies with search query', async () => {
      const mockCompanies: Company[] = [
        { id: '1', nameTh: 'Test Company', taxId: '1234567890123' } as Company,
      ];

      mockedApiClient.get.mockResolvedValueOnce({ data: mockCompanies });

      const result = await CompanyService.getAllCompanies('Test');
      expect(result).toEqual(mockCompanies);
      expect(mockedApiClient.get).toHaveBeenCalledWith('/api/companies?q=Test');
    });

    it('should throw error on failed fetch', async () => {
      mockedApiClient.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(CompanyService.getAllCompanies()).rejects.toThrow();
    });
  });

  describe('getCompanyById', () => {
    it('should fetch a single company', async () => {
      const mockCompany: Company = {
        id: '1',
        nameTh: 'Company 1',
        taxId: '1234567890123',
      } as Company;

      mockedApiClient.get.mockResolvedValueOnce({ data: mockCompany });

      const result = await CompanyService.getCompanyById('1');
      expect(result).toEqual(mockCompany);
      expect(mockedApiClient.get).toHaveBeenCalledWith('/api/companies/1');
    });
  });

  describe('createCompany', () => {
    it('should create a new company', async () => {
      const newCompanyData = {
        nameTh: 'New Company',
        taxId: '1234567890123',
      } as Company;

      const createdCompany: Company = {
        ...newCompanyData,
        id: '123',
      } as Company;

      mockedApiClient.post.mockResolvedValueOnce({ data: createdCompany });

      const result = await CompanyService.createCompany(newCompanyData);
      expect(result).toEqual(createdCompany);
      expect(mockedApiClient.post).toHaveBeenCalledWith('/api/companies', newCompanyData);
    });
  });

  describe('deleteCompany', () => {
    it('should delete a company', async () => {
      mockedApiClient.delete.mockResolvedValueOnce({});

      await CompanyService.deleteCompany('1');
      expect(mockedApiClient.delete).toHaveBeenCalledWith('/api/companies/1');
    });
  });
});

describe('AddressService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchByZipcode', () => {
    it('should search addresses by zipcode', async () => {
      const mockAddresses = [
        { subDistrict: 'Sub1', district: 'Dist1', province: 'Prov1', zipCode: '10110' },
      ];

      mockedApiClient.get.mockResolvedValueOnce({
        data: { addresses: mockAddresses },
        status: 200,
      });

      const result = await AddressService.searchByZipcode('10110');
      expect(result).toEqual(mockAddresses);
    });

    it('should return empty array on error', async () => {
      mockedApiClient.get.mockRejectedValueOnce(new Error('Not found'));

      const result = await AddressService.searchByZipcode('00000');
      expect(result).toEqual([]);
    });
  });
});
