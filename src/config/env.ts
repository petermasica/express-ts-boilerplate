import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  LOGGER_LOG_LABEL: z.string().default('DEMO-API'),
  LOGGER_LOG_LEVEL: z.enum(['debug', 'info']).default('debug'),
  LOGGER_IGNORED_ROUTES: z
    .array(z.string())
    .default(['/api-docs', '/health-check']),
  MONGO_URI: z.string().default('mongodb://localhost:27017'),
  MONGO_DB_NAME: z.string().default('demo'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(
    'Config validation error: ' +
      parsed.error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(', '),
  );
}

const envVars = parsed.data;

export const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  db: {
    uri: envVars.MONGO_URI,
    name:
      envVars.NODE_ENV === 'test'
        ? `${envVars.MONGO_DB_NAME}-test`
        : envVars.MONGO_DB_NAME,
  },
  logger: {
    logLabel: envVars.LOGGER_LOG_LABEL,
    logLevel: envVars.LOGGER_LOG_LEVEL,
    ignoredRoutes: envVars.LOGGER_IGNORED_ROUTES,
  },
} as const;
