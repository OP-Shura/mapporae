type LogLevel = 'info' | 'warn' | 'error';

interface LogContext {
  component?: string;
  action?: string;
  [key: string]: unknown;
}

const isProduction = process.env.NODE_ENV === 'production';
const isServer = typeof window === 'undefined';

function formatMessage(level: LogLevel, message: string, context?: LogContext) {
  const timestamp = new Date().toISOString();
  const envTag = isProduction ? 'PROD' : 'DEV';
  const comp = context?.component ? `[${context.component}]` : '';
  const act = context?.action ? `[${context.action}]` : '';
  return `[${timestamp}] [${envTag}] [${level.toUpperCase()}] ${comp}${act} ${message}`;
}

export const logger = {
  info(message: string, context?: LogContext) {
    if (!isProduction || isServer) {
      console.info(formatMessage('info', message, context), context?.details || '');
    }
  },

  warn(message: string, context?: LogContext) {
    console.warn(formatMessage('warn', message, context), context?.details || '');
  },

  error(message: string, error?: unknown, context?: LogContext) {
    const formatted = formatMessage('error', message, context);
    
    if (isServer) {
      // Server logs retain complete error details and stack traces
      console.error(formatted, error, context || '');
    } else {
      // Client logs in production avoid dumping sensitive internals
      if (isProduction) {
        console.error(formatted);
      } else {
        console.error(formatted, error, context || '');
      }
    }
  },
};
