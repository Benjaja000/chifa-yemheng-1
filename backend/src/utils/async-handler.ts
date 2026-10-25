import type { NextFunction, Request, RequestHandler, Response } from 'express';

/** Express 4 no captura rechazos de handlers async: los reenvía al errorHandler. */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
