import { ZodSchema } from 'zod';

export const generateZodValidationErrorExample = (schema: ZodSchema) => {
  const result = schema.safeParse({});

  if (result.success) {
    return null;
  }

  return {
    status: 'error',
    error: {
      message: 'Validation failed',
      details: result.error.errors.map((err) => ({
        field: err.path.join('.'),
        reason: err.message,
      })),
    },
    meta: {
      // Optionally add requestId and timestamp here
    },
  };
};
