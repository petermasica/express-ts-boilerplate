import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const productReadSchema = z
  .object({
    id: z.string().openapi({
      description: 'MongoDB ObjectId',
      example: '507f1f77bcf86cd799439011',
    }),
    name: z
      .string()
      .openapi({ example: 'Product Alpha', description: 'Product name' }),
    description: z.string().openapi({
      example: 'High-quality alpha product for everyday use.',
      description: 'Product description ',
    }),
    price: z.number().openapi({ example: 29.99, description: 'Product price' }),
    inStock: z
      .boolean()
      .openapi({ example: true, description: 'Is the product in stock?' }),
  })
  .openapi('ProductReadSchema', {
    description: 'API schema for reading a product',
  });

export const productCreateSchema = productReadSchema
  .omit({ id: true })
  .openapi('ProductCreateSchema', {
    description: 'API schema for creating a product',
  });

export const productUpdateSchema = productCreateSchema.partial();

export type ProductRead = z.infer<typeof productReadSchema>;
export type ProductCreate = z.infer<typeof productCreateSchema>;
export type ProductUpdate = z.infer<typeof productUpdateSchema>;
