import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

import { logger } from '~/config/logger';
import { APIError } from '~/error/api-error';
import { ErrorResponse } from '~/shared/schemas/response.schema';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction,
) => {
  let error = err;

  if (!(error instanceof APIError)) {
    error = new APIError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      httpStatus.INTERNAL_SERVER_ERROR,
      false,
    );
  }

  const apiError = error as APIError;

  logger.error(`${req.method} ${req.originalUrl} - ${apiError.message}`, {
    status: apiError.status,
    stack: apiError.stack,
    isPublic: apiError.isPublic,
    validationErrors: apiError.validationErrors,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  res.status(apiError.status).json({
    // message: apiError.isPublic
    //   ? apiError.message
    //   : (httpStatus[apiError.status as keyof typeof httpStatus] ??
    //     'Internal Server Error'),
    // ...(config.env !== 'production' && { stack: apiError.stack }),
    status: 'error',
    error: {
      message: apiError.isPublic
        ? apiError.message
        : httpStatus[apiError.status],
      ...(apiError.validationErrors && {
        details: apiError.validationErrors.map((err) => ({
          field: err.path.join('.'),
          reason: err.message,
        })),
      }),
    },
  });
};
