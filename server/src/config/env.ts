import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  CORS_ORIGIN: string;
  OPENAI_API_KEY?: string;
  OPENROUTER_API_KEY?: string;
  OPENROUTER_MODEL?: string;
  AI_MODEL?: string;         // legacy alias for OPENROUTER_MODEL
  AI_MAX_TOKENS?: number;
  AI_TEMPERATURE?: number;
  REDIS_URL?: string;
}

// ─── Dummy / Placeholder Detection ───────────────────────

const DUMMY_PATTERNS = ['dummy', 'placeholder', 'your-', 'your_', 'change-me', 'changeme', 'xxx', 'test_key'];

function isDummyValue(value: string): boolean {
  const lower = value.toLowerCase();
  return DUMMY_PATTERNS.some((p) => lower.includes(p));
}

// ─── Environment Loader ──────────────────────────────────

function getEnv(): EnvConfig {
  // 1. Validate required variables exist
  const requiredVars = ['DATABASE_URL', 'JWT_SECRET'] as const;
  for (const key of requiredVars) {
    if (!process.env[key]) {
      throw new Error(`❌ Missing required environment variable: ${key}`);
    }
  }

  // 2. Validate OPENROUTER_API_KEY
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (!openrouterKey) {
    console.warn('⚠️  OPENROUTER_API_KEY is not set. AI-DOST will not work.');
    console.warn('   Get a key at: https://openrouter.ai/keys');
  } else if (isDummyValue(openrouterKey)) {
    console.warn('⚠️  OPENROUTER_API_KEY appears to be a placeholder/dummy value.');
    console.warn('   AI-DOST requests will fail with 401 Unauthorized.');
    console.warn('   Replace it with a real key from: https://openrouter.ai/keys');
  }

  // 3. Validate JWT_SECRET
  if (isDummyValue(process.env.JWT_SECRET!)) {
    console.warn('⚠️  JWT_SECRET is a placeholder. Change it before deploying to production.');
  }

  // 4. Warn about DATABASE_URL
  if (isDummyValue(process.env.DATABASE_URL!)) {
    console.warn('⚠️  DATABASE_URL appears to be a placeholder. Database features may not work.');
  }

  // 5. Resolve model: OPENROUTER_MODEL > AI_MODEL > undefined (let ai.config handle default)
  const resolvedModel = process.env.OPENROUTER_MODEL || process.env.AI_MODEL;

  return {
    PORT: parseInt(process.env.PORT || '5000', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL!,
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENROUTER_API_KEY: openrouterKey,
    OPENROUTER_MODEL: resolvedModel,
    AI_MODEL: resolvedModel,     // keep backward compat
    AI_MAX_TOKENS: process.env.AI_MAX_TOKENS ? parseInt(process.env.AI_MAX_TOKENS, 10) : undefined,
    AI_TEMPERATURE: process.env.AI_TEMPERATURE ? parseFloat(process.env.AI_TEMPERATURE) : undefined,
    REDIS_URL: process.env.REDIS_URL,
  };
}

export const env = getEnv();
