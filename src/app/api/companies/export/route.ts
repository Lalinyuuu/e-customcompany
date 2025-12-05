import { NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/api/errorHandler';
import data from '@/lib/companies.json';
import { BadRequestError } from '@/lib/errors';
import { logger } from '@/lib/logger';
import { withRateLimit, apiRateLimiter } from '@/lib/security/rateLimit';
import { sanitizeString } from '@/lib/security/sanitize';

const handler = withErrorHandler(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    let format = searchParams.get('format') || 'csv';

    // Sanitize and validate format parameter
    format = sanitizeString(format.toLowerCase());

    if (format !== 'csv') {
      throw new BadRequestError("Unsupported format. Use 'csv'");
    }

    // Convert to CSV
    const headers = [
      'รหัสลูกค้า',
      'ชื่อบริษัท (ไทย)',
      'ชื่อบริษัท (อังกฤษ)',
      'เลขประจำตัวผู้เสียภาษี',
      'สาขา',
      'ที่อยู่',
      'แขวง/ตำบล',
      'เขต/อำเภอ',
      'จังหวัด',
      'รหัสไปรษณีย์',
      'เบอร์โทรศัพท์',
      'แฟกซ์',
      'อีเมล',
    ];

    const csvRows = [
      headers.join(','),
      ...data.map((company) => {
        // Sanitize CSV values to prevent CSV injection
        const sanitizeCsvValue = (value: string | undefined): string => {
          if (!value) return '';
          // Escape quotes and prevent CSV injection (formulas starting with =, +, -, @)
          const sanitized = String(value)
            .replace(/"/g, '""')
            .replace(/^[=+\-@]/, "'$&"); // Prevent formula injection
          return sanitized;
        };

        return [
          sanitizeCsvValue(company.customerCode),
          `"${sanitizeCsvValue(company.nameTh)}"`,
          `"${sanitizeCsvValue(company.nameEn)}"`,
          sanitizeCsvValue(company.taxId),
          sanitizeCsvValue(company.branch),
          `"${sanitizeCsvValue(company.address)}"`,
          sanitizeCsvValue(company.subDistrict),
          sanitizeCsvValue(company.district),
          sanitizeCsvValue(company.province),
          sanitizeCsvValue(company.zipCode),
          sanitizeCsvValue(company.phone),
          sanitizeCsvValue(company.fax),
          sanitizeCsvValue(company.email),
        ].join(',');
      }),
    ];

    const csv = csvRows.join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });

    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'text/csv;charset=utf-8;',
        'Content-Disposition': `attachment; filename="companies-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    logger.error('Export error', error instanceof Error ? error : new Error(String(error)));
    throw error;
  }
});

export const GET = withRateLimit(apiRateLimiter, handler);
