export function validateEnv(): void {
  const required: string[] = [
    // Add required env vars here if needed
    // 'DATABASE_URL',
    // 'API_KEY',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  logLevel: (process.env['LOG_LEVEL'] as 'debug' | 'info' | 'warn' | 'error') || 'info',
  geminiApiKey: process.env['GEMINI_API_KEY'],
} as const;

// Validate on module load (only in production)
if (env.isProduction) {
  validateEnv();
}
