import { NextFunction, Request, RequestHandler, Response } from 'express';

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler {
  return function (req: Request, res: Response, next: NextFunction): void {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      return next(error);
    });
  };
}

export default asyncHandler;
