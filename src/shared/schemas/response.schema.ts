import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const errorResponseSchema = z
  .object({
    status: z.literal('error').openapi({ description: 'Response status' }),
    error: z
      .object({
        message: z.string().openapi({
          description: 'Error message',
          example: 'Validation failed',
        }),
        details: z
          .array(
            z.object({
              field: z.string().optional().openapi({
                description: 'Field that caused the error',
                example: 'email',
              }),
              reason: z.string().openapi({
                description: 'Reason for the error',
                example: 'Invalid email format',
              }),
            }),
          )
          .optional()
          .openapi({ description: 'Validation error details' }),
      })
      .openapi({ description: 'Error details' }),
    meta: z
      .object({
        requestId: z.string().optional().openapi({
          description: 'Request ID',
          example: '550e8400-e29b-41d4-a716-446655440000',
        }),
        timestamp: z.string().optional().openapi({
          description: 'Timestamp',
          example: '2025-05-25T10:22:00Z',
        }),
      })
      .optional()
      .openapi({ description: 'Metadata' }),
  })
  .openapi('ErrorResponse', { description: 'Error response' });

export const successResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z
    .object({
      status: z.literal('success').openapi({ description: 'Response status' }),
      data: dataSchema.openapi({ description: 'Response data' }),
      message: z.string().optional().openapi({
        description: 'Success message',
        example: 'Operation successful',
      }),
      meta: z
        .object({
          requestId: z.string().optional().openapi({
            description: 'Request ID',
            example: '550e8400-e29b-41d4-a716-446655440000',
          }),
          timestamp: z.string().optional().openapi({
            description: 'Timestamp',
            example: '2025-05-25T10:22:00Z',
          }),
          pagination: z
            .object({
              total: z
                .number()
                .openapi({ description: 'Total items', example: 100 }),
              page: z
                .number()
                .openapi({ description: 'Current page', example: 2 }),
              limit: z
                .number()
                .openapi({ description: 'Items per page', example: 20 }),
              next: z.string().optional().openapi({
                description: 'Next page URL',
                example: '/api/items?page=3',
              }),
              prev: z.string().optional().openapi({
                description: 'Previous page URL',
                example: '/api/items?page=1',
              }),
            })
            .optional()
            .openapi({ description: 'Pagination info' }),
        })
        .optional()
        .openapi({ description: 'Metadata' }),
    })
    .openapi('SuccessResponse', { description: 'Success response' });

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type SuccessResponse<T> = z.infer<
  ReturnType<typeof successResponseSchema<z.ZodType<T>>>
>;
