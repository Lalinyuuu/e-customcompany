import { logger } from '@/lib/logger';

export class StorageService {
  static save<DataType>(key: string, data: DataType): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    try {
      const jsonString = JSON.stringify(data);
      window.localStorage.setItem(key, jsonString);
      logger.debug(`[StorageService] Saved data to key: ${key}`);
      return true;
    } catch (error) {
      logger.error(
        `[StorageService] Error saving to localStorage: ${key}`,
        error instanceof Error ? error : new Error(String(error))
      );
      return false;
    }
  }

  static load<DataType>(key: string): DataType | null {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const storedValue = window.localStorage.getItem(key);
      if (storedValue === null) {
        return null;
      }
      return JSON.parse(storedValue) as DataType;
    } catch (error) {
      logger.error(
        `[StorageService] Error loading from localStorage: ${key}`,
        error instanceof Error ? error : new Error(String(error))
      );
      return null;
    }
  }

  static remove(key: string): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    try {
      window.localStorage.removeItem(key);
      logger.debug(`[StorageService] Removed key: ${key}`);
      return true;
    } catch (error) {
      logger.error(
        `[StorageService] Error removing from localStorage: ${key}`,
        error instanceof Error ? error : new Error(String(error))
      );
      return false;
    }
  }

  static has(key: string): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.localStorage.getItem(key) !== null;
  }

  static clear(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    try {
      window.localStorage.clear();
      logger.debug('[StorageService] Cleared all localStorage');
      return true;
    } catch (error) {
      logger.error(
        '[StorageService] Error clearing localStorage',
        error instanceof Error ? error : new Error(String(error))
      );
      return false;
    }
  }

  static keys(): string[] {
    if (typeof window === 'undefined') {
      return [];
    }

    return Object.keys(window.localStorage);
  }

  static saveDraft<FormDataType extends Record<string, unknown>>(
    key: string,
    data: FormDataType
  ): boolean {
    const hasValidData = Object.values(data).some(
      (value) => value !== '' && value !== null && value !== undefined && value !== false
    );

    if (!hasValidData) {
      this.remove(key);
      return false;
    }

    return this.save(key, data);
  }

  static loadDraft<FormDataType extends Record<string, unknown>>(key: string): FormDataType | null {
    const data = this.load<FormDataType>(key);

    if (!data) {
      return null;
    }

    const hasValidData = Object.values(data).some(
      (value) => value !== '' && value !== null && value !== undefined && value !== false
    );

    if (!hasValidData) {
      this.remove(key);
      return null;
    }

    return data;
  }

  static clearDraft(key: string): boolean {
    return this.remove(key);
  }
}
