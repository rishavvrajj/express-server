import { NextFunction, Request, Response } from 'express';
import { logger } from '../libs/logger';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error({ err }, 'Unhandled error');

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
}