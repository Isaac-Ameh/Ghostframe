import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 👻 Spooky error logging
  console.error('💀 GhostFrame Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something spooky happened on the server';

  // 🎃 KIRO INTEGRATION POINT: Future hooks will monitor and auto-fix common errors
  res.status(statusCode).json({
    error: {
      message,
      code: err.code || 'INTERNAL_ERROR',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
    timestamp: new Date().toISOString(),
  });
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error: ApiError = new Error(`👻 Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  error.code = 'NOT_FOUND';
  next(error);
};