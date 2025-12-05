import { AxiosError } from 'axios';
import { API_ROUTES } from '@/constants';
import { NotFoundError, BadRequestError } from '@/lib/errors';
import { logger } from '@/lib/logger';
import apiClient from '@/lib/api/axiosInstance';
import { ThaiAddress } from '@/types/address';
import { Company, CompanyFormData } from '@/types/company';

export class CompanyService {
  static async getAllCompanies(query?: string): Promise<Company[]> {
    try {
      const url = query
        ? `${API_ROUTES.COMPANIES}?q=${encodeURIComponent(query)}`
        : API_ROUTES.COMPANIES;
      const { data } = await apiClient.get<Company[]>(url);
      return data;
    } catch (error) {
      logger.error(
        'Error fetching companies',
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  }

  static async getCompanyById(id: string): Promise<Company> {
    try {
      const { data } = await apiClient.get<Company>(API_ROUTES.COMPANY_BY_ID(id));
      return data;
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        throw new NotFoundError('Company not found');
      }
      logger.error(
        'Error fetching company',
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  }

  static async createCompany(companyData: CompanyFormData): Promise<Company> {
    try {
      const { data } = await apiClient.post<Company>(API_ROUTES.COMPANIES, companyData);
      return data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.error || 'Failed to create company';
        throw new BadRequestError(errorMessage);
      }
      logger.error(
        'Error creating company',
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  }

  static async updateCompany(id: string, companyData: Partial<CompanyFormData>): Promise<Company> {
    try {
      const { data } = await apiClient.put<Company>(API_ROUTES.COMPANY_BY_ID(id), companyData);
      return data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new NotFoundError('Company not found');
        }
        const errorMessage = error.response?.data?.error || 'Failed to update company';
        throw new BadRequestError(errorMessage);
      }
      logger.error(
        'Error updating company',
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  }

  static async deleteCompany(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ROUTES.COMPANY_BY_ID(id));
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        throw new NotFoundError('Company not found');
      }
      logger.error(
        'Error deleting company',
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  }

  static async exportCompanies(format: 'csv' = 'csv'): Promise<Blob> {
    try {
      const { data } = await apiClient.get(`${API_ROUTES.COMPANIES_EXPORT}?format=${format}`, {
        responseType: 'blob',
      });
      return data;
    } catch (error) {
      logger.error(
        'Error exporting companies',
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  }

  static async searchCompanies(query: string): Promise<Company[]> {
    return this.getAllCompanies(query);
  }
}

export class AddressService {
  static async searchByZipcode(zipcode: string, partial: boolean = true): Promise<ThaiAddress[]> {
    try {
      const url = `${API_ROUTES.THAI_ADDRESS}?zipcode=${encodeURIComponent(zipcode)}&partial=${partial}`;
      logger.debug(`[AddressService] Fetching: ${url}`);

      const { data, status } = await apiClient.get(url);
      logger.debug(`[AddressService] Response status: ${status}`);
      logger.debug(`[AddressService] Received data:`, data);

      return data.addresses && Array.isArray(data.addresses) ? data.addresses : [];
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        logger.warn(`[AddressService] API error:`, {
          status: error.response?.status,
          errorData: error.response?.data,
        });
      } else {
        logger.error(
          '[AddressService] Error fetching address suggestions',
          error instanceof Error ? error : new Error(String(error))
        );
      }
      return [];
    }
  }
}

export class AIService {
  static async generateAddress(companyName: string): Promise<{
    nameTh?: string;
    nameEn?: string;
    address: string;
    addressEn?: string;
    subDistrict: string;
    district: string;
    province: string;
    zipCode: string;
  }> {
    try {
      const { data } = await apiClient.post(API_ROUTES.AI_ADDRESS, { companyName });
      return data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.error || 'Failed to generate address';
        logger.error('[AIService] Auto-fill error', new Error(errorMessage));
        throw new Error(errorMessage);
      }
      logger.error(
        '[AIService] Auto-fill error',
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  }
}
