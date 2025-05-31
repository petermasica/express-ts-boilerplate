import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { WithId } from 'mongodb';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const productSchema = z
  .object({
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

export const paramsWithIdSchema = z.object({
  id: z.string().min(1),
});

export type Product = z.infer<typeof productSchema>;
export type ProductWithId = WithId<Product>;

export type ParamsWithId = z.infer<typeof paramsWithIdSchema>;
