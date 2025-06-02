import { NextFunction, Request, Response } from 'express';

import { SuccessResponse } from '~/shared/schemas/response.schema';

type ControllerHandler<
  T,
  VParams = unknown,
  VBody = unknown,
  VQuery = unknown,
> = (
  req: Request & {
    validated: {
      params: VParams;
      body: VBody;
      query: VQuery;
    };
  },
  res: Response<SuccessResponse<T>>,
) => Promise<void> | void;

export const forwardError =
  <T, VParams = unknown, VBody = unknown, VQuery = unknown>(
    callback: ControllerHandler<T, VParams, VBody, VQuery>,
  ) =>
  async (
    req: Request,
    res: Response<SuccessResponse<T>>,
    next: NextFunction,
  ) => {
    try {
      await callback(
        req as Request & {
          validated: {
            params: VParams;
            body: VBody;
            query: VQuery;
          };
        },
        res,
      );
    } catch (error) {
      next(error);
    }
  };
