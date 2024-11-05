import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodSchema } from 'zod';

export enum ResponseStatus {
  Success,
  Failed,
}

export class ServiceResponse<T = null> {
  success: boolean;
  message: string;
  payload: T;
  code: number;

  constructor(status: ResponseStatus, message: string, payload: T, statusCode: number) {
    this.success = status === ResponseStatus.Success;
    this.message = message;
    this.payload = payload;
    this.code = statusCode;
  }
}

export const responder = (payload: any, response: Response, code: number = 200) => {
  return response.status(payload?.code || code).send(payload);
};

export const redirectResponder = (response: Response, url: string, statusCode: number = 302) => {
  return response.redirect(statusCode, url);
};

export const validateRequest = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({ body: req.body, query: req.query, params: req.params });
    next();
  } catch (err: any) {
    const statusCode = StatusCodes.BAD_REQUEST;
    res.status(statusCode).json({
      message: 'Validation error',
      errors: (err?.errors || []).map((error: any) => ({
        path: error.path,
        message: error.message,
      })),
    });
  }
};
