import { useState, useEffect, useRef, useCallback } from 'react';
import { API } from '@/constants';
import { logger } from '@/lib/logger';
import { CompanyService } from '@/services/companyService';
import { Company, CompanyFormData } from '@/types/company';

export function useCompanySearch(
  formData: CompanyFormData,
  setFormData: React.Dispatch<React.SetStateAction<CompanyFormData>>,
  resetForm: () => void
) {
  const [companySuggestions, setCompanySuggestions] = useState<Company[]>([]);
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const companySuggestionRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const activeItem = listRef.current.children[highlightedIndex] as HTMLElement;
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  const handleCompanySearch = useCallback(async (query: string) => {
    if (query.length < API.COMPANY_SEARCH_MIN_LENGTH) {
      setCompanySuggestions([]);
      setShowCompanySuggestions(false);
      return;
    }

    try {
      const data = await CompanyService.searchCompanies(query);
      setCompanySuggestions(data);
      setShowCompanySuggestions(true);
      setHighlightedIndex(-1);
    } catch (error) {
      logger.error(
        'Error fetching company suggestions',
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }, []);

  const handleSelectCompany = useCallback(
    (company: Company) => {
      const { id, ...rest } = company;
      setFormData(rest);
      setShowCompanySuggestions(false);
      setHighlightedIndex(-1);
    },
    [setFormData]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showCompanySuggestions || companySuggestions.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < companySuggestions.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < companySuggestions.length) {
          const selectedCompany = companySuggestions[highlightedIndex];
          if (selectedCompany) {
            handleSelectCompany(selectedCompany);
          }
        }
      } else if (e.key === 'Escape') {
        setShowCompanySuggestions(false);
      }
    },
    [showCompanySuggestions, companySuggestions, highlightedIndex, handleSelectCompany]
  );

  const handleNameChange = useCallback(
    (name: string, value: string) => {
      handleCompanySearch(value);
      if (value === '') {
        resetForm();
      }
    },
    [handleCompanySearch, resetForm]
  );

  return {
    companySuggestions,
    showCompanySuggestions,
    setShowCompanySuggestions,
    highlightedIndex,
    companySuggestionRef,
    listRef,
    handleKeyDown,
    handleNameChange,
    handleSelectCompany,
  };
}
