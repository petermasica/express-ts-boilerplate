import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  APP_VERSION: z.string().default(process.env.npm_package_version ?? ''),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  LOGGER_LOG_LABEL: z.string().default('DEMO-API'),
  LOGGER_LOG_LEVEL: z.enum(['debug', 'info']).default('debug'),
  LOGGER_IGNORED_ROUTES: z
    .array(z.string())
    .default(['/api-docs', '/health-check']),
  MONGO_URI: z.string().default('mongodb://localhost:27017/demo'),
  MONGO_DB_NAME: z.string().default('demo'),
  DB_USER: z.string().default('fnc'),
  DB_PASSWORD: z.string().default('fnc-pass'),
  DB_HOST: z.string().default('localhost'),
  DB_DATABASE: z.string().default('fnc'),
  DB_PORT: z.coerce.number().default(5432),
  DB_SSL: z.coerce.boolean().default(false),
  DB_DESIRED_MIGRATION: z.string().default('20200518190000'),
  SQL_DEBUG: z.coerce.boolean().default(false),
  OPENAPI_BASE_SCHEMA: z.string().default('./src/openapi/api.schema.yml'),
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
  appVersion: envVars.APP_VERSION,
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  db: {
    uri: envVars.MONGO_URI,
    name: envVars.MONGO_DB_NAME,
  },
  // db: {
  //   user: envVars.DB_USER,
  //   password: envVars.DB_PASSWORD,
  //   host: envVars.DB_HOST,
  //   database: envVars.DB_DATABASE,
  //   port: envVars.DB_PORT,
  //   ssl: envVars.DB_SSL,
  // },
  sqlDebug: envVars.SQL_DEBUG,
  dbDesiredMigration: envVars.DB_DESIRED_MIGRATION,
  logger: {
    logLabel: envVars.LOGGER_LOG_LABEL,
    logLevel: envVars.LOGGER_LOG_LEVEL,
    ignoredRoutes: envVars.LOGGER_IGNORED_ROUTES,
  },
  openapiBaseSchema: envVars.OPENAPI_BASE_SCHEMA,
} as const;
