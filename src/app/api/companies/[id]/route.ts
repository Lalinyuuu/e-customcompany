import { NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/api/errorHandler';
import companies from '@/lib/companies.json';
import { NotFoundError, BadRequestError } from '@/lib/errors';
import { logger } from '@/lib/logger';
import { withRateLimit, apiRateLimiter } from '@/lib/security/rateLimit';
import { sanitizeString, sanitizeObject } from '@/lib/security/sanitize';

const getHandler = withErrorHandler(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params;
      const sanitizedId = sanitizeString(id);

      if (!sanitizedId) {
        throw new BadRequestError('Invalid company ID');
      }

      const company = companies.find((c) => c.id === sanitizedId);

      if (!company) {
        throw new NotFoundError('Company not found');
      }

      return NextResponse.json(company);
    } catch (error) {
      logger.error('Error in GET /api/companies/[id]', error);
      throw error;
    }
  }
);

export const GET = withRateLimit(apiRateLimiter, getHandler);

const putHandler = withErrorHandler(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params;
      const sanitizedId = sanitizeString(id);

      if (!sanitizedId) {
        throw new BadRequestError('Invalid company ID');
      }

      const body = await request.json();

      if (!body || typeof body !== 'object') {
        throw new BadRequestError('Invalid request body');
      }

      // Sanitize request body
      const sanitizedBody = sanitizeObject(body as Record<string, unknown>);

      // Simulate update
      return NextResponse.json({ id: sanitizedId, ...sanitizedBody });
    } catch (error) {
      logger.error('Error in PUT /api/companies/[id]', error);
      throw error;
    }
  }
);

export const PUT = withRateLimit(apiRateLimiter, putHandler);

const deleteHandler = withErrorHandler(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params;
      const sanitizedId = sanitizeString(id);

      if (!sanitizedId) {
        throw new BadRequestError('Invalid company ID');
      }

      // Simulate delete
      return NextResponse.json({ success: true, id: sanitizedId });
    } catch (error) {
      logger.error('Error in DELETE /api/companies/[id]', error);
      throw error;
    }
  }
);

export const DELETE = withRateLimit(apiRateLimiter, deleteHandler);
