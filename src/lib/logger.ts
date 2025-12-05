type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private isDevelopment: boolean;
  private logLevel: LogLevel;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.logLevel = (process.env['LOG_LEVEL'] as LogLevel) || 'info';
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  private log(level: LogLevel, message: string, data?: unknown, error?: Error): void {
    if (!this.shouldLog(level)) return;

    if (this.isDevelopment) {
      console[level === 'debug' ? 'log' : level](
        `[${level.toUpperCase()}] ${message}`,
        data || error || ''
      );
    } else {
      console[level === 'debug' ? 'log' : level](
        JSON.stringify({
          level,
          message,
          timestamp: new Date().toISOString(),
          data,
          error: error
            ? { name: error.name, message: error.message, stack: error.stack }
            : undefined,
        })
      );
    }
  }

  debug(message: string, data?: unknown): void {
    this.log('debug', message, data);
  }

  info(message: string, data?: unknown): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: unknown): void {
    this.log('warn', message, data);
  }

  error(message: string, error?: Error | unknown, data?: unknown): void {
    const err = error instanceof Error ? error : undefined;
    this.log('error', message, data, err);
  }
}

export const logger = new Logger();
