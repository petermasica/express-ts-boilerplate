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
  let apiError: APIError;

  const isNativeError = err instanceof Error;

  if (err instanceof APIError) {
    apiError = err;
  } else {
    apiError = new APIError(
      isNativeError ? err.message : 'An unexpected error occurred',
      httpStatus.INTERNAL_SERVER_ERROR,
      false,
    );

    if (isNativeError && err.stack) {
      apiError.stack = `${apiError.stack} \nCaused by:\n ${err.stack}`;
    }
  }

  logger.error(`${req.method} ${req.originalUrl} - ${apiError.message}`, {
    status: apiError.status,
    stack: apiError.stack,
    isPublic: apiError.isPublic,
    validationErrors: apiError.validationErrors,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  res.status(apiError.status).json({
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
