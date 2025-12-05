import { NextResponse } from 'next/server';
import { AppError } from '@/lib/errors';
import { logger } from '@/lib/logger';

export function handleApiError(error: unknown): NextResponse {
  // Log the error
  if (error instanceof AppError) {
    if (error.isOperational) {
      logger.warn(`API Error: ${error.message}`, {
        code: error.code,
        statusCode: error.statusCode,
      });
    } else {
      logger.error(`API Error: ${error.message}`, error, {
        code: error.code,
        statusCode: error.statusCode,
      });
    }
  } else {
    logger.error('Unexpected API error', error instanceof Error ? error : new Error(String(error)));
  }

  // Handle known error types
  if (error instanceof AppError) {
    const errorResponse: {
      error: string;
      code?: string;
      fields?: unknown;
    } = {
      error: error.message,
      code: error.code,
    };

    if (error instanceof Error && 'fields' in error) {
      errorResponse.fields = (error as { fields?: unknown }).fields;
    }

    return NextResponse.json(errorResponse, {
      status: error.statusCode,
    });
  }

  // Handle unknown errors
  const isDevelopment = process.env.NODE_ENV === 'development';
  return NextResponse.json(
    {
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
      ...(isDevelopment && error instanceof Error
        ? { details: error.message, stack: error.stack }
        : {}),
    },
    { status: 500 }
  );
}

export function withErrorHandler<HandlerParameters extends unknown[]>(
  handler: (...handlerParameters: HandlerParameters) => Promise<NextResponse>
) {
  return async (...handlerParameters: HandlerParameters): Promise<NextResponse> => {
    try {
      return await handler(...handlerParameters);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
