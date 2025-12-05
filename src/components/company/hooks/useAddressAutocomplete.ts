import { useState, useRef, useCallback, useEffect } from 'react';
import { API, VALIDATION } from '@/constants';
import { logger } from '@/lib/logger';
import { AddressService } from '@/services/companyService';
import { ThaiAddress } from '@/types/address';

export function useAddressAutocomplete() {
  const [suggestions, setSuggestions] = useState<ThaiAddress[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingZipcode, setIsSearchingZipcode] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const searchAddress = useCallback(async (zipcode: string) => {
    if (zipcode.length < VALIDATION.MIN_ZIPCODE_SEARCH_LENGTH) {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsSearchingZipcode(false);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      setIsSearchingZipcode(true);
      try {
        const isPartial = zipcode.length < VALIDATION.ZIP_CODE_LENGTH;
        const addresses = await AddressService.searchByZipcode(zipcode, isPartial);

        if (addresses.length > 0) {
          setSuggestions(addresses);
          setShowSuggestions(true);
          logger.debug(`[useAddressAutocomplete] Showing ${addresses.length} suggestions`);
        } else {
          logger.debug(`[useAddressAutocomplete] No addresses found`);
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        logger.error(
          '[useAddressAutocomplete] Error fetching address suggestions',
          error instanceof Error ? error : new Error(String(error))
        );
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsSearchingZipcode(false);
      }
    }, API.ZIPCODE_DEBOUNCE);
  }, []);

  const selectAddress = useCallback((address: ThaiAddress) => {
    setShowSuggestions(false);
    return address;
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setShowSuggestions(false);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    suggestions,
    showSuggestions,
    setShowSuggestions,
    isSearchingZipcode,
    searchAddress,
    selectAddress,
    clearSuggestions,
  };
}
