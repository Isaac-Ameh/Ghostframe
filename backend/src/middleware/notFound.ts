import { Request, Response, NextFunction } from 'express';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`👻 Route not found: ${req.originalUrl}`);
  res.status(404).json({
    error: {
      message: error.message,
      code: 'NOT_FOUND',
      path: req.originalUrl,
    },
    timestamp: new Date().toISOString(),
  });
};