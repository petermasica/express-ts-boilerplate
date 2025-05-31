import { NextFunction, Request, Response } from 'express';

import { SuccessResponse } from '~/schemas/response-schema';

type ControllerHandler<
  T,
  Params = unknown,
  ResBody = SuccessResponse<T>,
  ReqBody = unknown,
  ReqQuery = unknown,
> = (
  req: Request<Params, ResBody, ReqBody, ReqQuery>,
  res: Response<SuccessResponse<T>>,
) => Promise<void> | void;

export const forwardError =
  <
    T,
    Params = unknown,
    ResBody = SuccessResponse<T>,
    ReqBody = unknown,
    ReqQuery = unknown,
  >(
    callback: ControllerHandler<T, Params, ResBody, ReqBody, ReqQuery>,
  ) =>
  async (
    req: Request<Params, ResBody, ReqBody, ReqQuery>,
    res: Response<SuccessResponse<T>>,
    next: NextFunction,
  ) => {
    try {
      await callback(req, res);
    } catch (error) {
      next(error);
    }
  };
