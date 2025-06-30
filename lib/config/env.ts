import { z } from 'zod';

const envSchema = z.object({
  API_URL: z.string().url().default('http://localhost:5001'),
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:5001'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// For client-side usage (must use NEXT_PUBLIC_ prefix)
export const clientEnv = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001',
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};

// For server-side usage
export const env = envSchema.parse({
  API_URL: process.env.API_URL || 'http://localhost:5001',
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001',
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV,
});