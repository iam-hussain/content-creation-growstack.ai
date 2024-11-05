import express, { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import database from '@/providers/database';
import aiEventEmitter from '@/providers/events';
import asyncHandler from '@/utils/async-handler';
import { responder, ResponseStatus, ServiceResponse, validateRequest } from '@/utils/response';
import { generateContent } from '@/utils/schema';

const contentRouter: Router = (() => {
  const router = express.Router();

  router.post(
    '/generate',
    validateRequest(generateContent),
    asyncHandler(async (req, res) => {
      const { email, keywords, language, audience, tone } = req.body;

      try {
        // Store initial user input in the database
        const inputs = await database.userInput.create({
          data: { email, keywords, audience, language, tone },
        });

        aiEventEmitter.emit('generate-topics', { inputs });

        const response = new ServiceResponse(ResponseStatus.Success, 'User found', inputs, StatusCodes.OK);
        return responder(response, res);
      } catch (error) {
        console.error('Error initializing content generation:', error);
        const unauthorizedResponse = new ServiceResponse(
          ResponseStatus.Failed,
          'Failed to initialize content generation',
          null,
          StatusCodes.BAD_GATEWAY
        );
        return responder(unauthorizedResponse, res);
      }
    })
  );

  return router;
})();

export default contentRouter;
