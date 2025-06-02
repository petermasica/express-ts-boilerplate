import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const productWithIdSchema = z
  .object({
    id: z.string().openapi({
      example: '60c72b2f9b1e8b6f8f0e4d3a',
      description: 'Product ID',
    }),
    name: z
      .string()
      .openapi({ example: 'Product Alpha', description: 'Product name' }),
    description: z.string().openapi({
      example: 'High quality product for everyday use.',
      description: 'Product description ',
    }),
    price: z.number().openapi({ example: 29.99, description: 'Product price' }),
    inStock: z
      .boolean()
      .openapi({ example: true, description: 'Is the product in stock?' }),
  })
  .openapi('ProductWithIdSchema', {
    description: 'API schema for fetching a product',
  });

export const productSchema = productWithIdSchema
  .omit({ id: true })
  .openapi('ProductSchema', {
    description: 'API schema for creating or updating a product',
  });

export const productParamsSchema = z
  .object({
    id: z
      .string()
      .refine((val) => ObjectId.isValid(val), {
        message: 'Invalid ObjectId',
      })
      .openapi({
        example: '60c72b2f9b1e8b6f8f0e4d3a',
        description: 'MongoDB ObjectId',
      }),
  })
  .openapi('ProductParamsSchema', {
    description: 'API schema for id param validation',
  });

export const productQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1)
    .openapi({ example: 1, description: 'Page number for pagination' }),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(50)
    .default(10)
    .openapi({ example: 10, description: 'Number of items per page' }),
});

export type ProductWithId = z.infer<typeof productWithIdSchema>;
export type Product = z.infer<typeof productSchema>;
export type ProductParams = z.infer<typeof productParamsSchema>;
export type ProductQuery = z.infer<typeof productQuerySchema>;
