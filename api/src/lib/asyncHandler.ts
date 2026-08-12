import type { NextFunction, Request, Response } from "express";

// Express 4 doesn't catch rejected promises from async route handlers — an
// unhandled rejection (e.g. the DB connection drops) crashes the whole
// process instead of failing just that one request. Wrapping handlers here
// routes the error to Express's error middleware instead.
type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export function asyncHandler(handler: AsyncRouteHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, next).catch(next);
  };
}
