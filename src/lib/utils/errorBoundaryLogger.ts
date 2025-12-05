import { logger } from '@/lib/logger';

export interface ErrorInfo {
  componentStack: string;
}

export class ErrorBoundaryLogger {
  static logError(error: Error, errorInfo: ErrorInfo, componentName?: string) {
    const context = componentName ? ` in ${componentName}` : '';

    logger.error(`Error boundary caught error${context}`, error, {
      componentStack: errorInfo.componentStack,
      errorMessage: error.message,
      errorName: error.name,
      errorStack: error.stack,
    });

    if (process.env.NODE_ENV === 'development') {
      console.group(`[ERROR] Error Boundary${context}`);
      console.error('Error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }
  }

  static createErrorReport(error: Error, errorInfo: ErrorInfo, context?: Record<string, unknown>) {
    return {
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        name: error.name,
        stack: error.stack,
      },
      componentStack: errorInfo.componentStack,
      context: context || {},
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };
  }

  static async sendErrorReport(
    error: Error,
    errorInfo: ErrorInfo,
    context?: Record<string, unknown>
  ) {
    const report = this.createErrorReport(error, errorInfo, context);
    logger.info('Error report created', report);
    return report;
  }
}
