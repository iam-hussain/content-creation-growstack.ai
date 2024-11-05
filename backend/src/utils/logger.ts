import pino from 'pino';

import env from '@/providers/env-config';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: { colorize: true },
        }
      : undefined,
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;
