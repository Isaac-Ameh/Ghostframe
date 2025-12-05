// 🎃 GhostFrame Environment Configuration & Validation
// Validates and exports environment variables

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

interface EnvConfig {
  // Server
  nodeEnv: string;
  port: number;
  frontendUrl: string;

  // Database
  db: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
    poolMax: number;
    idleTimeout: number;
    connectionTimeout: number;
  };

  // Authentication
  jwt: {
    secret: string;
    expiresIn: string;
    refreshExpiresIn: string;
  };
  bcryptRounds: number;

  // AI Services
  groq: {
    apiKey?: string;
    enabled: boolean;
  };
  openai: {
    apiKey?: string;
    enabled: boolean;
  };
  anthropic: {
    apiKey?: string;
    enabled: boolean;
  };

  // Rate Limiting
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };

  // File Upload
  upload: {
    maxFileSize: number;
    uploadDir: string;
  };

  // Redis (Optional)
  redis: {
    url?: string;
    enabled: boolean;
  };

  // Email (Optional)
  email: {
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    from?: string;
    enabled: boolean;
  };

  // Logging
  logging: {
    level: string;
    file?: string;
  };

  // Admin
  admin: {
    email: string;
    password: string;
  };
}

/**
 * Validate required environment variables
 */
function validateEnv(): void {
  const required = [
    'PORT',
    'DB_HOST',
    'DB_PORT',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
    'JWT_SECRET',
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\n💡 Copy .env.example to .env and fill in the values');
    process.exit(1);
  }

  // Validate JWT secret strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn('⚠️  JWT_SECRET should be at least 32 characters long');
  }

  // Validate database connection
  if (process.env.DB_PASSWORD === 'your_secure_password_here') {
    console.warn('⚠️  Please change the default database password');
  }

  // Validate admin credentials
  if (process.env.ADMIN_PASSWORD === 'change_this_secure_password') {
    console.warn('⚠️  Please change the default admin password');
  }
}

/**
 * Parse and export environment configuration
 */
function loadConfig(): EnvConfig {
  // Validate first
  if (process.env.NODE_ENV !== 'test') {
    validateEnv();
  }

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3001'),
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

    db: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      name: process.env.DB_NAME || 'ghostframe',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      poolMax: parseInt(process.env.DB_POOL_MAX || '20'),
      idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
      connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000'),
    },

    jwt: {
      secret: process.env.JWT_SECRET || '',
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    },
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10'),

    groq: {
      apiKey: process.env.GROQ_API_KEY,
      enabled: !!process.env.GROQ_API_KEY,
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      enabled: !!process.env.OPENAI_API_KEY,
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      enabled: !!process.env.ANTHROPIC_API_KEY,
    },

    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    },

    upload: {
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'),
      uploadDir: process.env.UPLOAD_DIR || './uploads',
    },

    redis: {
      url: process.env.REDIS_URL,
      enabled: process.env.REDIS_ENABLED === 'true',
    },

    email: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : undefined,
      user: process.env.SMTP_USER,
      password: process.env.SMTP_PASSWORD,
      from: process.env.SMTP_FROM,
      enabled: !!(process.env.SMTP_HOST && process.env.SMTP_USER),
    },

    logging: {
      level: process.env.LOG_LEVEL || 'info',
      file: process.env.LOG_FILE,
    },

    admin: {
      email: process.env.ADMIN_EMAIL || 'admin@ghostframe.dev',
      password: process.env.ADMIN_PASSWORD || '',
    },
  };
}

// Export configuration
export const config = loadConfig();

// Export validation function for testing
export { validateEnv };

// Log configuration on startup (hide sensitive data)
if (process.env.NODE_ENV !== 'test') {
  console.log('✅ Environment configuration loaded:');
  console.log(`   - Environment: ${config.nodeEnv}`);
  console.log(`   - Port: ${config.port}`);
  console.log(`   - Database: ${config.db.host}:${config.db.port}/${config.db.name}`);
  console.log(`   - Groq: ${config.groq.enabled ? 'Enabled' : 'Disabled'}`);
  console.log(`   - OpenAI: ${config.openai.enabled ? 'Enabled' : 'Disabled'}`);
  console.log(`   - Anthropic: ${config.anthropic.enabled ? 'Enabled' : 'Disabled'}`);
  console.log(`   - Redis: ${config.redis.enabled ? 'Enabled' : 'Disabled'}`);
  console.log(`   - Email: ${config.email.enabled ? 'Enabled' : 'Disabled'}`);
}
