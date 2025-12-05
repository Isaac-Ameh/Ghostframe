// 🎃 Environment Configuration - Centralized environment variable management

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface EnvironmentConfig {
  // Server
  nodeEnv: string;
  port: number;
  frontendUrl: string;

  // Database
  database: {
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
  auth: {
    jwtSecret: string;
    jwtExpiresIn: string;
    jwtRefreshExpiresIn: string;
    bcryptRounds: number;
  };

  // AI Services
  ai: {
    groqApiKey?: string;
    openaiApiKey?: string;
    anthropicApiKey?: string;
  };

  // Supabase
  supabase: {
    url?: string;
    anonKey?: string;
    serviceRoleKey?: string;
  };

  // Email
  email: {
    enabled: boolean;
    from: string;
  };

  // Redis
  redis: {
    url?: string;
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

  // Logging
  logging: {
    level: string;
    file: string;
  };

  // Admin
  admin: {
    email: string;
    password: string;
  };
}

// Parse and validate environment variables
const config: EnvironmentConfig = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'ghostframe',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    poolMax: parseInt(process.env.DB_POOL_MAX || '20', 10),
    idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
    connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000', 10),
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET || 'change-this-secret-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  },

  ai: {
    groqApiKey: process.env.GROQ_API_KEY,
    openaiApiKey: process.env.OPENAI_API_KEY,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  },

  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },

  email: {
    enabled: process.env.EMAIL_ENABLED === 'true' || !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    from: process.env.EMAIL_FROM || 'noreply@ghostframe.dev',
  },

  redis: {
    url: process.env.REDIS_URL,
    enabled: process.env.REDIS_ENABLED === 'true',
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
    uploadDir: process.env.UPLOAD_DIR || './uploads',
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || './logs/app.log',
  },

  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@ghostframe.dev',
    password: process.env.ADMIN_PASSWORD || 'change_this_secure_password',
  },
};

// Validation warnings
const warnings: string[] = [];

if (config.auth.jwtSecret === 'change-this-secret-in-production') {
  warnings.push('⚠️  Please change the default JWT secret');
}

if (config.admin.password === 'change_this_secure_password') {
  warnings.push('⚠️  Please change the default admin password');
}

if (!config.database.password) {
  warnings.push('⚠️  Database password is not set');
}

// Log configuration status
console.log('\n✅ Environment configuration loaded:');
console.log(`- Environment: ${config.nodeEnv}`);
console.log(`- Port: ${config.port}`);
console.log(`- Database: ${config.database.host}:${config.database.port}/${config.database.name}`);
console.log(`- Groq: ${config.ai.groqApiKey ? 'Enabled' : 'Disabled'}`);
console.log(`- OpenAI: ${config.ai.openaiApiKey ? 'Enabled' : 'Disabled'}`);
console.log(`- Anthropic: ${config.ai.anthropicApiKey ? 'Enabled' : 'Disabled'}`);
console.log(`- Supabase: ${config.supabase.url ? 'Enabled' : 'Disabled'}`);
console.log(`- Redis: ${config.redis.enabled ? 'Enabled' : 'Disabled'}`);
console.log(`- Email: ${config.email.enabled ? 'Enabled' : 'Disabled'}`);

if (warnings.length > 0) {
  console.log('\n' + warnings.join('\n'));
}

console.log('');

export default config;
export { EnvironmentConfig };
