import { NextResponse } from 'next/server';
// @ts-expect-error - Thai address database doesn't have TypeScript definitions
import { searchAddressByZipcode } from 'thai-address-database';
import { withErrorHandler } from '@/lib/api/errorHandler';
import { BadRequestError } from '@/lib/errors';
import { logger } from '@/lib/logger';
import { withRateLimit, addressSearchRateLimiter } from '@/lib/security/rateLimit';
import { sanitizeNumber } from '@/lib/security/sanitize';

interface ThaiAddress {
  subDistrict: string;
  district: string;
  province: string;
  zipCode: string;
}

interface RawThaiAddressResult {
  district: string;
  amphoe: string;
  province: string;
  zipcode?: string | number;
}

const handler = withErrorHandler(async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    let zipcode = searchParams.get('zipcode');
    const partialParam = searchParams.get('partial');

    if (zipcode) {
      zipcode = sanitizeNumber(zipcode);
    }

    const partial = partialParam === 'true' || partialParam === '1';

    logger.debug(`Thai Address API Request: zipcode=${zipcode}, partial=${partial}`);

    if (!zipcode) {
      throw new BadRequestError('Zipcode parameter is required');
    }

    if (!/^\d{2,5}$/.test(zipcode)) {
      throw new BadRequestError('Invalid zipcode format. Must be 2-5 digits.');
    }

    let addresses: ThaiAddress[] = [];

    const rawResults = searchAddressByZipcode(zipcode) as RawThaiAddressResult[];

    if (rawResults && Array.isArray(rawResults)) {
      addresses = rawResults.map((rawAddress: RawThaiAddressResult) => ({
        subDistrict: rawAddress.district,
        district: rawAddress.amphoe,
        province: rawAddress.province,
        zipCode: rawAddress.zipcode ? String(rawAddress.zipcode) : zipcode || '',
      }));

      const uniqueAddresses = new Map<string, ThaiAddress>();

      for (const addr of addresses) {
        const key = `${addr.subDistrict}-${addr.district}-${addr.province}-${addr.zipCode}`;
        if (!uniqueAddresses.has(key)) {
          uniqueAddresses.set(key, addr);
        }
      }

      addresses = Array.from(uniqueAddresses.values());

      if (addresses.length > 50) {
        addresses = addresses.slice(0, 50);
      }
    }

    logger.info(`Thai Address API Found ${addresses.length} addresses for zipcode: ${zipcode}`);

    return NextResponse.json({
      addresses,
      count: addresses.length,
    });
  } catch (error) {
    logger.error('Error in GET /api/thai-address', error);
    throw error;
  }
});

export const GET = withRateLimit(addressSearchRateLimiter, handler);
