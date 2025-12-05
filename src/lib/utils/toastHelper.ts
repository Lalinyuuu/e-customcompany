import { toast } from 'sonner';
import { logger } from '@/lib/logger';

export class ToastHelper {
  static success(message: string, description?: string) {
    toast.success(message, {
      description,
      duration: 3000,
    });
  }

  static error(message: string, description?: string) {
    toast.error(message, {
      description,
      duration: 5000,
    });
  }

  static warning(message: string, description?: string) {
    toast.warning(message, {
      description,
      duration: 4000,
    });
  }

  static info(message: string, description?: string) {
    toast.info(message, {
      description,
      duration: 3000,
    });
  }

  static async promise<PromiseResultType>(
    promise: Promise<PromiseResultType>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ): Promise<PromiseResultType> {
    toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
    return promise;
  }

  static handleApiError(error: unknown, defaultMessage: string = 'An error occurred') {
    let errorMessage = defaultMessage;
    let errorDescription: string | undefined;

    if (error instanceof Error) {
      errorMessage = error.message || defaultMessage;
      logger.error('API Error', error);
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    // Parse API error responses
    if (error && typeof error === 'object' && 'response' in error) {
      type ApiErrorResponse = {
        response?: {
          data?: {
            error?: string;
            message?: string;
          };
        };
      };

      const response = (error as ApiErrorResponse).response;

      if (response?.data?.error) {
        errorMessage = response.data.error;
      }

      if (response?.data?.message) {
        errorDescription = response.data.message;
      }
    }

    this.error(errorMessage, errorDescription);
  }

  static validationError(message: string = 'Validation failed', errors?: Record<string, string>) {
    const description = errors
      ? Object.entries(errors)
          .slice(0, 3) // Show max 3 errors
          .map(([field, error]) => `${field}: ${error}`)
          .join('\n')
      : undefined;

    this.error(message, description);
  }

  static custom(
    component: React.ReactElement | ((id: string | number) => React.ReactElement),
    options?: { duration?: number }
  ) {
    const renderComponent = (id: string | number): React.ReactElement => {
      if (typeof component === 'function') {
        return component(id);
      }
      return component;
    };

    toast.custom(renderComponent, {
      duration: options?.duration || 3000,
    });
  }

  static dismiss(toastId?: string | number) {
    toast.dismiss(toastId);
  }

  static dismissAll() {
    toast.dismiss();
  }
}
