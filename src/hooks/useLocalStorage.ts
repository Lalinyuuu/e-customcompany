import { useState, useCallback } from 'react';
import { logger } from '@/lib/logger';

export function useLocalStorage<StorageValueType>(
  key: string,
  initialValue: StorageValueType
): [
  StorageValueType,
  (value: StorageValueType | ((currentValue: StorageValueType) => StorageValueType)) => void,
  () => void,
] {
  const [storedValue, setStoredValue] = useState<StorageValueType>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const storedItem = window.localStorage.getItem(key);
      return storedItem ? JSON.parse(storedItem) : initialValue;
    } catch (error) {
      logger.error(
        `Error reading localStorage key "${key}"`,
        error instanceof Error ? error : new Error(String(error))
      );
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: StorageValueType | ((currentValue: StorageValueType) => StorageValueType)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        logger.error(
          `Error setting localStorage key "${key}"`,
          error instanceof Error ? error : new Error(String(error))
        );
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      logger.error(
        `Error removing localStorage key "${key}"`,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
