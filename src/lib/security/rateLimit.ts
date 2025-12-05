interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const record = this.store[identifier];

    if (!record || now > record.resetTime) {
      this.store[identifier] = {
        count: 1,
        resetTime: now + this.windowMs,
      };
      return true;
    }

    if (record.count >= this.maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }

  getResetTime(identifier: string): number {
    const record = this.store[identifier];
    return record?.resetTime || Date.now() + this.windowMs;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const key in this.store) {
      const record = this.store[key];
      if (record && record.resetTime < now) {
        delete this.store[key];
      }
    }
  }
}

// Create rate limiters for different endpoints
export const apiRateLimiter = new RateLimiter(100, 15 * 60 * 1000); // 100 requests per 15 minutes
export const addressSearchRateLimiter = new RateLimiter(50, 60 * 1000); // 50 requests per minute
export const aiAddressRateLimiter = new RateLimiter(20, 60 * 1000); // 20 requests per minute

export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0] || realIp || 'unknown';
}

export function withRateLimit<HandlerParameters extends unknown[]>(
  limiter: RateLimiter,
  handler: (request: Request, ...handlerParameters: HandlerParameters) => Promise<Response>
) {
  return async (request: Request, ...handlerParameters: HandlerParameters): Promise<Response> => {
    const identifier = getClientIdentifier(request);

    if (!limiter.isAllowed(identifier)) {
      const resetTime = limiter.getResetTime(identifier);
      return new Response(
        JSON.stringify({
          error: 'Too many requests',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil((resetTime - Date.now()) / 1000)),
          },
        }
      );
    }

    return handler(request, ...handlerParameters);
  };
}
