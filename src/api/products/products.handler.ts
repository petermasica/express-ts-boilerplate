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
import { forwardError } from '~/shared/utils/forward-error';

export const createOne = forwardError<ProductWithId, unknown, Product>(
  async (req, res) => {
    const newProduct = await createProduct(req.validated.body);

    res.status(httpStatus.CREATED).json({
      status: 'success',
      data: newProduct,
      message: 'Product created successfully',
    });
  },
);

export const findAll = forwardError<
  ProductWithId[],
  unknown,
  unknown,
  ProductQuery
>(async (req, res) => {
  const paginatedProducts = await getPaginatedProducts(req.validated.query);

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
    const product = await getProductById(req.validated.params.id);

    res.json({
      status: 'success',
      data: product,
      message: 'Product fetched successfully',
    });
  },
);
