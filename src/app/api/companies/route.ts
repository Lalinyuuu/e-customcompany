import { NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/api/errorHandler';
import data from '@/lib/companies.json';
import { BadRequestError } from '@/lib/errors';
import { logger } from '@/lib/logger';
import { withRateLimit, apiRateLimiter } from '@/lib/security/rateLimit';
import { sanitizeString, sanitizeObject } from '@/lib/security/sanitize';

const getHandler = withErrorHandler(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (query) {
      const sanitizedQuery = sanitizeString(query);
      const lowerQuery = sanitizedQuery.toLowerCase();
      const filteredData = data.filter(
        (company) =>
          (typeof company.nameTh === 'string' &&
            company.nameTh.toLowerCase().includes(lowerQuery)) ||
          (typeof company.nameEn === 'string' &&
            company.nameEn.toLowerCase().includes(lowerQuery)) ||
          (typeof company.taxId === 'string' && company.taxId.includes(sanitizedQuery)) ||
          (typeof company.customerCode === 'string' &&
            company.customerCode.toLowerCase().includes(lowerQuery)) ||
          (typeof company.address === 'string' &&
            company.address.toLowerCase().includes(lowerQuery)) ||
          (typeof company.phone === 'string' && company.phone.includes(sanitizedQuery))
      );
      return NextResponse.json(filteredData);
    }

    return NextResponse.json(data);
  } catch (error) {
    logger.error('Error in GET /api/companies', error);
    throw error;
  }
});

export const GET = withRateLimit(apiRateLimiter, getHandler);

const postHandler = withErrorHandler(async (request: Request) => {
  try {
    const body = await request.json();

    if (!body || typeof body !== 'object') {
      throw new BadRequestError('Invalid request body');
    }

    const sanitizedBody = sanitizeObject(body as Record<string, unknown>);

    const newCompany = {
      id: Math.random().toString(36).substring(2, 11),
      ...sanitizedBody,
    };

    return NextResponse.json(newCompany, { status: 201 });
  } catch (error) {
    logger.error('Error in POST /api/companies', error);
    throw error;
  }
});

export const POST = withRateLimit(apiRateLimiter, postHandler);
