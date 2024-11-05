import { ErrorRequestHandler, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import env from '@/providers/env-config';
import logger from '@/utils/logger';

import { responder, ResponseStatus, ServiceResponse } from './response';

const isProduction = env.NODE_ENV === 'production';

// Handle all undefined routes and respond with 404 Not Found
export const handleNotFound: RequestHandler = (_req, res) => {
  const serviceResponse = new ServiceResponse(ResponseStatus.Failed, 'Not Found', null, StatusCodes.NOT_FOUND);
  return responder(serviceResponse, res);
};

// Middleware to respond with an appropriate error message based on the environment
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleErrorResponse: ErrorRequestHandler = (err, _req, res, _next) => {
  logger.error({
    message: err.message,
    stack: !isProduction ? err.stack : undefined, // Only include stack trace in non-production environments
    statusCode: res.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  });

  const statusCode = res.statusCode !== StatusCodes.OK ? res.statusCode : StatusCodes.INTERNAL_SERVER_ERROR;
  const errorResponse = {
    message: isProduction ? 'Something went wrong' : err.message,
    ...(isProduction ? {} : { stack: err.stack }),
  };

  const serviceResponse = new ServiceResponse(
    ResponseStatus.Failed,
    'Something went wrong',
    errorResponse,
    statusCode || StatusCodes.BAD_REQUEST
  );
  return responder(serviceResponse, res);
};
