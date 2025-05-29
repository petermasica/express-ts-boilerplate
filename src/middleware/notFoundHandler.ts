import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

import { APIError } from '~/error/apiError';

export function notFoundHandler(
  _req: Request,
  _res: Response,
  next: NextFunction,
) {
  next(new APIError('Resource not found', httpStatus.NOT_FOUND, true));
}
