import httpStatus from 'http-status';
import { ObjectId } from 'mongodb';

import { Products } from './products.model';
import { Product, ProductQuery } from './products.schema';
import { logger } from '~/config/logger';
import { APIError } from '~/error/api-error';
import { mapMongoId } from '~/shared/utils/map-mongo-id';

export const createProduct = async (product: Product) => {
  const insertResult = await Products().insertOne(product);

  if (!insertResult.acknowledged) {
    logger.error('Failed to cteate the product', { product });

    throw new APIError(
      'Failed to create the product',
      httpStatus.INTERNAL_SERVER_ERROR,
      true,
    );
  }

  return mapMongoId({
    _id: insertResult.insertedId,
    ...product,
  });
};

export const getPaginatedProducts = async (paginationOptions: ProductQuery) => {
  const { page, limit } = paginationOptions;
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Products().find({}).skip(skip).limit(limit).toArray(),
    Products().countDocuments(),
  ]);

  return {
    products: products.map(mapMongoId),
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

  return mapMongoId(products[0]);
};
