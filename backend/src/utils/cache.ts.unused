// 🎃 Caching Layer - Redis and in-memory caching

import { createClient } from 'redis';
import logger from './logger';

// In-memory cache fallback
class MemoryCache {
  private cache: Map<string, { value: any; expiry: number }> = new Map();

  set(key: string, value: any, ttl: number = 3600): void {
    const expiry = Date.now() + ttl * 1000;
    this.cache.set(key, { value, expiry });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

class CacheManager {
  private redisClient: any = null;
  private memoryCache: MemoryCache = new MemoryCache();
  private useRedis: boolean = false;

  async initialize(): Promise<void> {
    const redisUrl = process.env.REDIS_URL;

    if (redisUrl) {
      try {
        this.redisClient = createClient({ url: redisUrl });

        this.redisClient.on('error', (err: Error) => {
          logger.error('Redis client error:', err);
          this.useRedis = false;
        });

        this.redisClient.on('connect', () => {
          logger.info('Redis client connected');
          this.useRedis = true;
        });

        await this.redisClient.connect();
      } catch (error) {
        logger.warn('Redis not available, using in-memory cache', { error });
        this.useRedis = false;
      }
    } else {
      logger.info('Redis URL not configured, using in-memory cache');
    }

    // Cleanup memory cache every 5 minutes
    setInterval(() => {
      this.memoryCache.cleanup();
    }, 5 * 60 * 1000);
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    const serialized = JSON.stringify(value);

    if (this.useRedis && this.redisClient) {
      try {
        await this.redisClient.setEx(key, ttl, serialized);
        return;
      } catch (error) {
        logger.error('Redis set error:', error);
      }
    }

    this.memoryCache.set(key, value, ttl);
  }

  async get(key: string): Promise<any | null> {
    if (this.useRedis && this.redisClient) {
      try {
        const value = await this.redisClient.get(key);
        return value ? JSON.parse(value) : null;
      } catch (error) {
        logger.error('Redis get error:', error);
      }
    }

    return this.memoryCache.get(key);
  }

  async delete(key: string): Promise<void> {
    if (this.useRedis && this.redisClient) {
      try {
        await this.redisClient.del(key);
        return;
      } catch (error) {
        logger.error('Redis delete error:', error);
      }
    }

    this.memoryCache.delete(key);
  }

  async clear(): Promise<void> {
    if (this.useRedis && this.redisClient) {
      try {
        await this.redisClient.flushAll();
        return;
      } catch (error) {
        logger.error('Redis clear error:', error);
      }
    }

    this.memoryCache.clear();
  }

  async disconnect(): Promise<void> {
    if (this.redisClient) {
      await this.redisClient.quit();
    }
  }
}

// Singleton instance
const cache = new CacheManager();

// Cache key generators
export const cacheKeys = {
  module: (id: string) => `module:${id}`,
  moduleList: (filters: string) => `modules:list:${filters}`,
  reviews: (moduleId: string) => `reviews:${moduleId}`,
  userProfile: (userId: string) => `user:${userId}`,
  stats: () => 'stats:dashboard',
  search: (query: string) => `search:${query}`,
};

// Cache TTL constants (in seconds)
export const cacheTTL = {
  short: 60, // 1 minute
  medium: 300, // 5 minutes
  long: 3600, // 1 hour
  day: 86400, // 24 hours
};

// Middleware for caching responses
export const cacheMiddleware = (ttl: number = cacheTTL.medium) => {
  return async (req: any, res: any, next: any) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey = `route:${req.originalUrl}`;

    try {
      const cachedResponse = await cache.get(cacheKey);

      if (cachedResponse) {
        logger.debug('Cache hit', { key: cacheKey });
        return res.json(cachedResponse);
      }

      // Store original json method
      const originalJson = res.json.bind(res);

      // Override json method to cache response
      res.json = (body: any) => {
        cache.set(cacheKey, body, ttl).catch((err) => {
          logger.error('Failed to cache response', { error: err });
        });
        return originalJson(body);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error', { error });
      next();
    }
  };
};

export default cache;
