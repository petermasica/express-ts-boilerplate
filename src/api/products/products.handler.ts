import httpStatus from 'http-status';

import {
  createProduct,
  getPaginatedProducts,
  getProductById,
} from './products.repository';
import {
  Product,
  ProductParams,
  ProductQuery,
  ProductWithId,
} from './products.schema';
import { SuccessResponse } from '~/shared/schemas/response.schema';
import { forwardError } from '~/shared/utils/forward-error';

export const createOne = forwardError<
  ProductWithId,
  unknown,
  SuccessResponse<ProductWithId>,
  Product
>(async (req, res) => {
  const newProduct = await createProduct(req.body);

  res.status(httpStatus.CREATED).json({
    status: 'success',
    data: newProduct,
    message: 'Product created successfully',
  });
});

export const findAll = forwardError<ProductWithId[]>(async (req, res) => {
  const paginatedProducts = await getPaginatedProducts(
    req.validatedQuery as ProductQuery,
  );

  res.json({
    status: 'success',
    data: paginatedProducts.products,
    message: 'Products fetched successfully',
    meta: {
      pagination: paginatedProducts.pagination,
    },
  });
});

export const findOne = forwardError<ProductWithId, ProductParams>(
  async (req, res) => {
    const product = await getProductById(req.params.id);

    res.json({
      status: 'success',
      data: product,
      message: 'Product fetched successfully',
    });
  },
);
