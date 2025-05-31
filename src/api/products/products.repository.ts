import httpStatus from 'http-status';
import { ObjectId } from 'mongodb';

import { Products } from './products.model';
import { Product, ProductWithId } from './products.schema';
import { logger } from '~/config/logger';
import { APIError } from '~/error/api-error';

export const createProduct = async (
  product: Product,
): Promise<ProductWithId> => {
  const insertResult = await Products().insertOne(product);

  if (!insertResult.acknowledged) {
    logger.error('Failed to cteate the product', { product });

    throw new APIError(
      'Failed to create the product',
      httpStatus.INTERNAL_SERVER_ERROR,
      true,
    );
  }

  return {
    ...product,
    _id: insertResult.insertedId,
  };
};

export const getPaginatedProducts = async (
  paginationOptions: { page: number; limit: number } = { page: 1, limit: 20 },
) => {
  const page = paginationOptions.page > 0 ? paginationOptions.page : 1;
  const limit = paginationOptions.limit > 0 ? paginationOptions.limit : 20;
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Products().find().skip(skip).limit(limit).toArray(),
    Products().countDocuments(),
  ]);

  return {
    products,
    pagination: {
      limit,
      page,
      total,
    },
  };
};

export const getProductById = async (productId: string) => {
  const products = await Products()
    .find({ _id: new ObjectId(productId) })
    .toArray();

  if (products.length === 0) {
    throw new APIError(
      `Product with id ${productId} not found`,
      httpStatus.NOT_FOUND,
      true,
    );
  }

  if (products.length > 1) {
    throw new APIError(
      `Multiple products with id ${productId} have been found`,
      httpStatus.UNPROCESSABLE_ENTITY,
      true,
    );
  }

  return products[0];
};
