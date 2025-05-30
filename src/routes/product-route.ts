import { Router } from 'express';
import httpStatus from 'http-status';

import { APIError } from '~/error/api-error';
import { productCreateSchema, ProductRead } from '~/schemas/product-schema';
import {
  createProduct,
  getPaginatedProducts,
} from '~/services/product-service';
import { forwardError } from '~/utils/forward-error';

const router = Router();

// const mockProducts = [
//   {
//     id: 'b5e8c6a2-2e3a-4c1d-9f7b-1a2e3c4d5f6a',
//     name: 'Product Alpha',
//     description: 'High-quality alpha product for everyday use.',
//     price: 29.99,
//     inStock: true,
//   },
//   {
//     id: 'e7d2b1c4-8f3e-4a6b-9c2d-7b8e1f2a3c4d',
//     name: 'Product Beta',
//     description: 'Reliable beta product with advanced features.',
//     price: 49.99,
//     inStock: false,
//   },
//   {
//     id: 'f1a9b8c7-3e2d-4c5b-8a7e-6d5c4b3a2f1e',
//     name: 'Product Gamma',
//     description: 'Affordable gamma product for budget-conscious buyers.',
//     price: 19.99,
//     inStock: true,
//   },
// ];

router.post(
  '/',
  forwardError<ProductRead>(async (req, res) => {
    const result = productCreateSchema.safeParse(req.body);

    if (!result.success) {
      throw new APIError(
        'Validation failed',
        httpStatus.BAD_REQUEST,
        true,
        result.error.errors,
      );
    }

    const newProduct = await createProduct(result.data);
    // console.log('*** new product ***', newProduct);

    if (!newProduct) {
      throw new APIError(
        'Failed to create product',
        httpStatus.INTERNAL_SERVER_ERROR,
        true,
      );
    }

    res.status(httpStatus.CREATED).json({
      status: 'success',
      data: newProduct,
      message: 'Product created successfully',
    });
  }),
);

router.get(
  '/',
  forwardError<ProductRead[]>(async (_req, res) => {
    const productsWithPagination = await getPaginatedProducts();

    res.json({
      status: 'success',
      data: productsWithPagination.products,
      message: 'Products fetched successfully',
      meta: {
        pagination: productsWithPagination.pagination,
      },
    });
  }),
);

export const productsRouter = router;
