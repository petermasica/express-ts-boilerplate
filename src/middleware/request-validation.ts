import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { AnyZodObject, ZodError } from 'zod';

import { APIError } from '~/error/api-error';

type RequestValidators = {
  params?: AnyZodObject;
  body?: AnyZodObject;
  query?: AnyZodObject;
};

export const validateRequest =
  (validators: RequestValidators) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.validated = { params: undefined, body: undefined, query: undefined };

      if (validators.params) {
        req.validated.params = validators.params.parse(req.params);
      }

      if (validators.body) {
        req.validated.body = validators.body.parse(req.body);
      }

      if (validators.query) {
        req.validated.query = validators.query.parse(req.query);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new APIError(
            'Validation failed',
            httpStatus.BAD_REQUEST,
            true,
            error.errors,
          ),
        );
      }

      next(error);
    }
  };
