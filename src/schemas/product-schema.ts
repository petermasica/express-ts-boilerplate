import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const productDbSchema = z
  .object({
    _id: z.string().openapi({
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
  .openapi('ProductDbSchema', { description: 'Database product schema' });

export const productReadSchema = productDbSchema
  .omit({ _id: true })
  .extend({
    id: z.string().openapi({
      description: 'Product ID (MongoDB ObjectId)',
      example: '507f1f77bcf86cd799439011',
    }),
  })
  .openapi('ProductReadSchema', {
    description: 'API product schema',
  });

export const productCreateSchema = z
  .object({
    name: productDbSchema.shape.name,
    description: productDbSchema.shape.description,
    price: productDbSchema.shape.price,
    inStock: productDbSchema.shape.inStock,
  })
  .openapi('ProductCreateSchema', {
    description: 'API schema for creating a product',
  });

export const productUpdateSchema = productReadSchema.partial();

export type ProductDb = z.infer<typeof productDbSchema>;

export type ProductRead = z.infer<typeof productReadSchema>;
export type ProductUpdate = z.infer<typeof productUpdateSchema>;

// Transform function to convert DB to API shape
export const transformProductDbToApi = (data: ProductDb): ProductRead => ({
  id: data._id,
  name: data.name,
  description: data.description,
  price: data.price,
  inStock: data.inStock,
});
