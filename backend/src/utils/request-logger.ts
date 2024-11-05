import { pinoHttp } from 'pino-http';

import logger from '@/utils/logger';

const requestLogger = () => {
  return pinoHttp({
    logger,
    customLogLevel: (_req, res, err) => {
      if ((res?.statusCode && res.statusCode >= 500) || err) {
        return 'error';
      } else if (res?.statusCode && res.statusCode >= 400) {
        return 'warn';
      }
      return 'info';
    },
    serializers: {
      req: (req) => `${req.method} ${req.url} from ${req.remoteAddress}:${req.remotePort}`,
      res: (res) => `status: ${res.statusCode}`,
      err: () => undefined,
    },
    customSuccessMessage: (res) => {
      if (res.statusCode === 404) {
        return 'Resource not found';
      }
      return 'Request completed';
    },
    customErrorMessage: (error, res) => {
      return `Request errored with status code: ${res.statusCode}`;
    },
  });
};

export default requestLogger;
