// 🎃 GhostFrame Rate Limiting Middleware
// Protects API endpoints from abuse

import rateLimit from 'express-rate-limit';
import { config } from '../config/env';

/**
 * General API rate limiter
 */
export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs, // 15 minutes default
  max: config.rateLimit.maxRequests, // 100 requests per window
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: config.rateLimit.windowMs / 1000,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict rate limiter for authentication endpoints
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: 900,
  },
  skipSuccessfulRequests: true,
});

/**
 * Rate limiter for file uploads
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 uploads per hour
  message: {
    error: 'Upload limit exceeded, please try again later.',
    retryAfter: 3600,
  },
});

/**
 * Rate limiter for marketplace publishing
 */
export const publishLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 10, // 10 publishes per day
  message: {
    error: 'Publishing limit exceeded, please try again tomorrow.',
    retryAfter: 86400,
  },
});

/**
 * Rate limiter for review submissions
 */
export const reviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 reviews per hour
  message: {
    error: 'Review submission limit exceeded, please try again later.',
    retryAfter: 3600,
  },
});
