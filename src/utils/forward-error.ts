import { NextFunction, Request, Response } from 'express';

import { SuccessResponse } from '~/schemas/response-schema';

type ControllerHandler<T> = (
  req: Request,
  res: Response<SuccessResponse<T>>,
) => Promise<void> | void;

export const forwardError =
  <T>(callback: ControllerHandler<T>) =>
  async (
    req: Request,
    res: Response<SuccessResponse<T>>,
    next: NextFunction,
  ) => {
    try {
      await callback(req, res);
    } catch (error) {
      next(error);
    }
  };
