import { Router } from 'express';
import httpStatus from 'http-status';
import { randomUUID } from 'node:crypto';

import { APIError } from '~/error/api-error';
import { productCreateSchema, ProductRead } from '~/schemas/product-schema';
import { forwardError } from '~/utils/forward-error';

const router = Router();

const mockProducts = [
  {
    id: 'b5e8c6a2-2e3a-4c1d-9f7b-1a2e3c4d5f6a',
    name: 'Product Alpha',
    description: 'High-quality alpha product for everyday use.',
    price: 29.99,
    inStock: true,
  },
  {
    id: 'e7d2b1c4-8f3e-4a6b-9c2d-7b8e1f2a3c4d',
    name: 'Product Beta',
    description: 'Reliable beta product with advanced features.',
    price: 49.99,
    inStock: false,
  },
  {
    id: 'f1a9b8c7-3e2d-4c5b-8a7e-6d5c4b3a2f1e',
    name: 'Product Gamma',
    description: 'Affordable gamma product for budget-conscious buyers.',
    price: 19.99,
    inStock: true,
  },
];

router.get(
  '/',
  forwardError<ProductRead[]>((_req, res) => {
    res.json({
      status: 'success',
      data: mockProducts,
      message: 'Products fetched successfully',
    });
  }),
);

router.post(
  '/',
  forwardError<ProductRead>((req, res) => {
    const result = productCreateSchema.safeParse(req.body);

    if (!result.success) {
      throw new APIError(
        'Validation failed',
        httpStatus.BAD_REQUEST,
        true,
        result.error.errors,
      );
    }

    const newProduct: ProductRead = {
      id: randomUUID(),
      ...result.data,
    };
    mockProducts.push(newProduct);

    res.status(httpStatus.CREATED).json({
      status: 'success',
      data: newProduct,
      message: 'Product created successfully',
    });
  }),
);

export const productsRouter = router;
