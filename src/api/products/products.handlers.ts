import { Request } from 'express';
import httpStatus from 'http-status';

import {
  createProduct,
  getPaginatedProducts,
  getProductById,
} from './products.repository';
import { Product, ProductWithId } from './products.schema';
import { forwardError } from '~/utils/forward-error';

export const createOne = forwardError<ProductWithId>(
  async (req: Request<unknown, unknown, Product>, res) => {
    const newProduct = await createProduct(req.body);

    res.status(httpStatus.CREATED).json({
      status: 'success',
      data: newProduct,
      message: 'Product created successfully',
    });
  },
);

export const findAll = forwardError<ProductWithId[]>(async (_req, res) => {
  const productsWithPagination = await getPaginatedProducts();

  res.json({
    status: 'success',
    data: productsWithPagination.products,
    message: 'Products fetched successfully',
    meta: {
      pagination: productsWithPagination.pagination,
    },
  });
});

export const findOne = forwardError<ProductWithId>(
  async (req: Request, res) => {
    const product = await getProductById(req.params.id);

    res.json({
      status: 'success',
      data: product,
      message: 'Product fetched successfully',
    });
  },
);
