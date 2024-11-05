import express, { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import asyncHandler from '@/utils/async-handler';
import { responder, ResponseStatus, ServiceResponse } from '@/utils/response';

const healthCheckRouter: Router = (() => {
  const router = express.Router();

  router.get('/ping', (_req: Request, res: Response) => {
    const serviceResponse = new ServiceResponse(ResponseStatus.Success, 'pong', null, StatusCodes.OK);
    return responder(serviceResponse, res);
  });

  router.get(
    '/error',
    asyncHandler(() => {
      throw new Error('Some error');
    })
  );

  return router;
})();

export default healthCheckRouter;
