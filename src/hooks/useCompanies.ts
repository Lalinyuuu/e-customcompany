import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants';
import { logger } from '@/lib/logger';
import { CompanyService } from '@/services/companyService';
import { CompanyFormData } from '@/types/company';

export function useCompanies(searchQuery?: string) {
  return useQuery({
    queryKey: searchQuery ? QUERY_KEYS.COMPANY_SEARCH(searchQuery) : QUERY_KEYS.COMPANIES,
    queryFn: () => CompanyService.getAllCompanies(searchQuery),
    staleTime: 0, // Always refetch to get latest results
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while loading
  });
}

export function useCompany(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.COMPANY(id),
    queryFn: () => CompanyService.getCompanyById(id),
    enabled: !!id,
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CompanyFormData) => CompanyService.createCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMPANIES });
      logger.info('[useCreateCompany] Company created successfully');
    },
    onError: (error) => {
      logger.error(
        '[useCreateCompany] Failed to create company',
        error instanceof Error ? error : new Error(String(error))
      );
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CompanyFormData> }) =>
      CompanyService.updateCompany(id, data),
    onSuccess: (updatedCompany) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMPANIES });
      queryClient.setQueryData(QUERY_KEYS.COMPANY(updatedCompany.id), updatedCompany);
      logger.info('[useUpdateCompany] Company updated successfully');
    },
    onError: (error) => {
      logger.error(
        '[useUpdateCompany] Failed to update company',
        error instanceof Error ? error : new Error(String(error))
      );
    },
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => CompanyService.deleteCompany(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMPANIES });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.COMPANY(deletedId) });
      logger.info('[useDeleteCompany] Company deleted successfully');
    },
    onError: (error) => {
      logger.error(
        '[useDeleteCompany] Failed to delete company',
        error instanceof Error ? error : new Error(String(error))
      );
    },
  });
}

export function useExportCompanies() {
  return useMutation({
    mutationFn: (format: 'csv' = 'csv') => CompanyService.exportCompanies(format),
    onError: (error) => {
      logger.error(
        '[useExportCompanies] Failed to export companies',
        error instanceof Error ? error : new Error(String(error))
      );
    },
  });
}
