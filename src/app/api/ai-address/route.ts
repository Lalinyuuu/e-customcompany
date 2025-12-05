import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/api/errorHandler';
import { BadRequestError } from '@/lib/errors';
import { logger } from '@/lib/logger';
import { withRateLimit, aiAddressRateLimiter } from '@/lib/security/rateLimit';
import { sanitizeString } from '@/lib/security/sanitize';

const mockCompanyAddresses: Record<
  string,
  {
    nameTh: string;
    nameEn: string;
    address: string;
    addressEn: string;
    subDistrict: string;
    district: string;
    province: string;
    zipCode: string;
  }
> = {
  การบินไทย: {
    nameTh: 'บริษัท การบินไทย จำกัด (มหาชน)',
    nameEn: 'Thai Airways International Public Company Limited',
    address: '89 ถนนวิภาวดีรังสิต',
    addressEn: '89 Vibhavadi Rangsit Road',
    subDistrict: 'ดอนเมือง',
    district: 'ดอนเมือง',
    province: 'กรุงเทพมหานคร',
    zipCode: '10210',
  },
  ไทยสมายล์: {
    nameTh: 'บริษัท ไทยสมายล์ แอร์เวย์ จำกัด',
    nameEn: 'Thai Smile Airways Company Limited',
    address: '89 ถนนวิภาวดีรังสิต',
    addressEn: '89 Vibhavadi Rangsit Road',
    subDistrict: 'ดอนเมือง',
    district: 'ดอนเมือง',
    province: 'กรุงเทพมหานคร',
    zipCode: '10210',
  },
  บางกอกแอร์เวย์ส: {
    nameTh: 'บริษัท บางกอกแอร์เวย์ส จำกัด (มหาชน)',
    nameEn: 'Bangkok Airways Public Company Limited',
    address: '99 หมู่ 14 ถนนสุขุมวิท',
    addressEn: '99 Moo 14 Sukhumvit Road',
    subDistrict: 'บางนา',
    district: 'บางนา',
    province: 'กรุงเทพมหานคร',
    zipCode: '10260',
  },
  'แคเรียร์ แอร์ คอนดิชั่นนิ่ง': {
    nameTh: 'บริษัท แคเรียร์ แอร์ คอนดิชั่นนิ่ง (ประเทศไทย) จำกัด',
    nameEn: 'CARRIER AIR CONDITIONING (THAILAND) CO., LTD.',
    address: '144/9 หมู่ที่ 5 สวนอุตสาหกรรมบางกะดี ถนนติวานนท์',
    addressEn:
      '144/9 Moo 5 Bangkadi Industrial Park Tiwanon Road, Bangkadi, Mueang Pathum Thani, Pathum Thani 12000',
    subDistrict: 'บางกะดี',
    district: 'เมืองปทุมธานี',
    province: 'ปทุมธานี',
    zipCode: '12000',
  },
  'แคเรีย บางกะดี': {
    nameTh: 'บริษัท แคเรียร์ แอร์ คอนดิชั่นนิ่ง (ประเทศไทย) จำกัด',
    nameEn: 'CARRIER AIR CONDITIONING (THAILAND) CO., LTD.',
    address: '144/9 หมู่ที่ 5 สวนอุตสาหกรรมบางกะดี ถนนติวานนท์',
    addressEn:
      '144/9 Moo 5 Bangkadi Industrial Park Tiwanon Road, Bangkadi, Mueang Pathum Thani, Pathum Thani 12000',
    subDistrict: 'บางกะดี',
    district: 'เมืองปทุมธานี',
    province: 'ปทุมธานี',
    zipCode: '12000',
  },
  'carrier air conditioning': {
    nameTh: 'บริษัท แคเรียร์ แอร์ คอนดิชั่นนิ่ง (ประเทศไทย) จำกัด',
    nameEn: 'CARRIER AIR CONDITIONING (THAILAND) CO., LTD.',
    address: '144/9 หมู่ที่ 5 สวนอุตสาหกรรมบางกะดี ถนนติวานนท์',
    addressEn:
      '144/9 Moo 5 Bangkadi Industrial Park Tiwanon Road, Bangkadi, Mueang Pathum Thani, Pathum Thani 12000',
    subDistrict: 'บางกะดี',
    district: 'เมืองปทุมธานี',
    province: 'ปทุมธานี',
    zipCode: '12000',
  },
  carrier: {
    nameTh: 'บริษัท แคเรียร์ แอร์ คอนดิชั่นนิ่ง (ประเทศไทย) จำกัด',
    nameEn: 'CARRIER AIR CONDITIONING (THAILAND) CO., LTD.',
    address: '144/9 หมู่ที่ 5 สวนอุตสาหกรรมบางกะดี ถนนติวานนท์',
    addressEn:
      '144/9 Moo 5 Bangkadi Industrial Park Tiwanon Road, Bangkadi, Mueang Pathum Thani, Pathum Thani 12000',
    subDistrict: 'บางกะดี',
    district: 'เมืองปทุมธานี',
    province: 'ปทุมธานี',
    zipCode: '12000',
  },
};

function generateMockAddress(companyName: string): {
  nameTh: string;
  nameEn: string;
  address: string;
  addressEn: string;
  subDistrict: string;
  district: string;
  province: string;
  zipCode: string;
} {
  const normalizedName = companyName.trim().toLowerCase();

  if (mockCompanyAddresses[normalizedName]) {
    return mockCompanyAddresses[normalizedName];
  }

  for (const [key, value] of Object.entries(mockCompanyAddresses)) {
    if (normalizedName.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedName)) {
      return value;
    }
  }

  if (normalizedName.includes('แคเรียร์') || normalizedName.includes('carrier')) {
    const carrierAddress = mockCompanyAddresses['carrier'];
    if (carrierAddress) {
      return carrierAddress;
    }
  }

  const commonAddresses = [
    {
      address: '123/45 ถนนสุขุมวิท',
      addressEn: '123/45 Sukhumvit Road, Khlong Toei, Khlong Toei, Bangkok 10110',
      subDistrict: 'คลองเตย',
      district: 'คลองเตย',
      province: 'กรุงเทพมหานคร',
      zipCode: '10110',
    },
    {
      address: '456 ถนนพระราม 4',
      addressEn: '456 Rama IV Road, Silom, Bang Rak, Bangkok 10500',
      subDistrict: 'สีลม',
      district: 'บางรัก',
      province: 'กรุงเทพมหานคร',
      zipCode: '10500',
    },
    {
      address: '789 ถนนวิภาวดีรังสิต',
      addressEn: '789 Vibhavadi Rangsit Road, Chom Phon, Chatuchak, Bangkok 10900',
      subDistrict: 'จอมพล',
      district: 'จตุจักร',
      province: 'กรุงเทพมหานคร',
      zipCode: '10900',
    },
    {
      address: '99 หมู่ 5 ถนนบางนา-ตราด',
      addressEn: '99 Moo 5 Bangna-Trat Road, Bang Na, Bang Na, Bangkok 10260',
      subDistrict: 'บางนา',
      district: 'บางนา',
      province: 'กรุงเทพมหานคร',
      zipCode: '10260',
    },
  ];

  const hash = companyName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const selectedAddress = commonAddresses[hash % commonAddresses.length];
  if (!selectedAddress) {
    // Fallback to first address if somehow index is out of bounds
    const fallbackAddress = commonAddresses[0];
    if (!fallbackAddress) {
      // Last resort fallback
      return {
        nameTh: companyName,
        nameEn: companyName,
        address: '',
        addressEn: '',
        subDistrict: '',
        district: '',
        province: '',
        zipCode: '',
      };
    }
    return {
      nameTh: companyName,
      nameEn: companyName,
      ...fallbackAddress,
    };
  }

  const isThai = /[\u0E00-\u0E7F]/.test(companyName);

  return {
    nameTh: isThai ? companyName : `${companyName} (ไทย)`,
    nameEn: isThai ? `${companyName} (English)` : companyName,
    address: selectedAddress.address,
    addressEn: selectedAddress.addressEn,
    subDistrict: selectedAddress.subDistrict,
    district: selectedAddress.district,
    province: selectedAddress.province,
    zipCode: selectedAddress.zipCode,
  };
}

function createGeminiPrompt(companyName: string): string {
  return `คุณเป็นผู้ช่วยที่เชี่ยวชาญในการค้นหาข้อมูลบริษัทในประเทศไทย

กรุณาค้นหาข้อมูลที่อยู่ของบริษัทนี้: "${companyName}"

ตอบกลับในรูปแบบ JSON เท่านั้น โดยมีฟิลด์ดังนี้:
{
  "nameTh": "ชื่อบริษัทภาษาไทย (ถ้ามี)",
  "nameEn": "ชื่อบริษัทภาษาอังกฤษ (ถ้ามี)",
  "address": "เลขที่และชื่อถนน",
  "addressEn": "ที่อยู่ภาษาอังกฤษ",
  "subDistrict": "แขวง/ตำบล",
  "district": "เขต/อำเภอ",
  "province": "จังหวัด",
  "zipCode": "รหัสไปรษณีย์ 5 หลัก"
}

ถ้าไม่พบข้อมูล ให้ตอบกลับเป็น JSON ว่างเปล่า {}`;
}

function cleanJsonText(text: string): string {
  let jsonText = text.trim();
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/```\n?/g, '');
  }
  return jsonText;
}


type ParsedAddressData = {
  nameTh?: string;
  nameEn?: string;
  address?: string;
  addressEn?: string;
  subDistrict?: string;
  district?: string;
  province?: string;
  zipCode?: string;
};

function parseGeminiResponse(jsonText: string): ParsedAddressData | null {
  try {
    return JSON.parse(jsonText) as ParsedAddressData;
  } catch (parseError) {
    logger.warn('[AI] Failed to parse JSON response from Gemini', {
      error: parseError instanceof Error ? parseError.message : String(parseError),
      responseText: jsonText.substring(0, 200),
    });
    return null;
  }
}

function validateAndFormatAddress(
  parsed: ParsedAddressData | null,
  companyName: string
): {
  nameTh: string;
  nameEn: string;
  address: string;
  addressEn: string;
  subDistrict: string;
  district: string;
  province: string;
  zipCode: string;
} | null {
  if (!parsed || typeof parsed !== 'object') {
    logger.debug('[AI] Parsed data is null or not an object');
    return null;
  }

  // Require at least subDistrict, district, province, and zipCode for valid address
  const hasRequiredFields = 
    parsed.subDistrict && 
    parsed.district && 
    parsed.province && 
    parsed.zipCode;

  if (!hasRequiredFields) {
    logger.debug('[AI] Missing required fields:', {
      hasSubDistrict: !!parsed.subDistrict,
      hasDistrict: !!parsed.district,
      hasProvince: !!parsed.province,
      hasZipCode: !!parsed.zipCode,
    });
    return null;
  }

  // Validate zipCode is 5 digits
  const zipCode = String(parsed.zipCode).trim();
  if (!/^\d{5}$/.test(zipCode)) {
    logger.debug(`[AI] Invalid zipCode format: "${zipCode}"`);
    return null;
  }

  return {
    nameTh: parsed.nameTh || companyName,
    nameEn: parsed.nameEn || companyName,
    address: parsed.address || '',
    addressEn: parsed.addressEn || '',
    subDistrict: String(parsed.subDistrict).trim(),
    district: String(parsed.district).trim(),
    province: String(parsed.province).trim(),
    zipCode: zipCode,
  };
}

async function getAddressFromGemini(companyName: string): Promise<{
  nameTh: string;
  nameEn: string;
  address: string;
  addressEn: string;
  subDistrict: string;
  district: string;
  province: string;
  zipCode: string;
} | null> {
  const apiKey = process.env['GEMINI_API_KEY'];

  if (!apiKey || apiKey.trim() === '') {
    logger.info('[AI] GEMINI_API_KEY not found or empty, will use fallback mock data');
    return null;
  }

  // Log API key status (first 10 chars only for security)
  logger.debug(`[AI] GEMINI_API_KEY found (${apiKey.length} chars, starts with: ${apiKey.substring(0, 10)}...)`);

  try {
    logger.debug(`[AI] Attempting to fetch address from Gemini API for: "${companyName}"`);
    const genAI = new GoogleGenerativeAI(apiKey);
    const prompt = createGeminiPrompt(companyName);

    // Try different model names in order of preference
    // Based on error, v1beta API may not support newer models
    // Try standard model names that work with Google Generative AI SDK
    // Updated based on available models for the user's API key
    const modelNames = ['gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-pro-latest'];
    let lastError: Error | null = null;

    for (const modelName of modelNames) {
      try {
        logger.debug(`[AI] Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        logger.debug(`[AI] Sending prompt to Gemini API (${modelName})`);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        logger.debug(`[AI] ✓ Successfully got response from ${modelName} (${text.length} chars)`);
        
        const jsonText = cleanJsonText(text);
        const parsed = parseGeminiResponse(jsonText);

        if (!parsed) {
          logger.warn(`[AI] Failed to parse Gemini response as JSON from ${modelName}`);
          continue; // Try next model
        }

        logger.debug(`[AI] Parsed response:`, parsed);
        const addressData = validateAndFormatAddress(parsed, companyName);
        
        if (addressData) {
          logger.info(`[AI] ✓ Successfully fetched and validated address from Gemini API (${modelName}) for: "${companyName}"`);
          return addressData;
        } else {
          logger.warn(`[AI] Gemini API (${modelName}) returned data but validation failed for: "${companyName}"`);
          logger.debug(`[AI] Parsed data:`, parsed);
          continue; // Try next model
        }
      } catch (modelError) {
        const errorMsg = modelError instanceof Error ? modelError.message : String(modelError);
        logger.warn(`[AI] Model ${modelName} failed: ${errorMsg.substring(0, 200)}`);
        lastError = modelError instanceof Error ? modelError : new Error(String(modelError));
        continue; // Try next model
      }
    }

    // All models failed
    if (lastError) {
      throw lastError;
    }
    
    return null;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    
    logger.error(
      `[AI] Gemini API error (${errorName}): ${errorMessage}`,
      error instanceof Error ? error : new Error(String(error)),
      { companyName, errorName, errorMessage }
    );
    
    // Log more details for debugging
    if (error instanceof Error && error.stack) {
      logger.debug(`[AI] Error stack: ${error.stack.substring(0, 500)}`);
    }
    
    return null;
  }
}

const handler = withErrorHandler(async (req: Request) => {
  let companyName: string;

  try {
    const body = await req.json();
    companyName = body.companyName;

    if (!companyName || typeof companyName !== 'string') {
      throw new BadRequestError('Company name is required');
    }

    companyName = sanitizeString(companyName);
  } catch (parseError) {
    if (parseError instanceof BadRequestError) {
      throw parseError;
    }
    throw new BadRequestError('Invalid request body');
  }

  try {
    let addressData = await getAddressFromGemini(companyName);

    if (!addressData) {
      logger.info(`[MOCK] Using fallback mock data for: "${companyName}" (AI API unavailable or returned no data)`);
      const delay = Math.random() * 1000 + 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
      addressData = generateMockAddress(companyName);
    }

    return NextResponse.json(addressData);
  } catch (error) {
    logger.error(
      'Error in AI auto-fill',
      error instanceof Error ? error : new Error(String(error))
    );

    try {
      const delay = Math.random() * 1000 + 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
      const addressData = generateMockAddress(companyName);
      return NextResponse.json(addressData);
    } catch (fallbackError) {
      logger.error(
        'Fallback error in AI auto-fill',
        fallbackError instanceof Error ? fallbackError : new Error(String(fallbackError))
      );
      throw error;
    }
  }
});

export const POST = withRateLimit(aiAddressRateLimiter, handler);
