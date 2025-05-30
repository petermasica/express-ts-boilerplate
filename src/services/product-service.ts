import httpStatus from 'http-status';

import * as productRepository from '~/repositories/product-repository';
import { APIError } from '~/error/api-error';
import { ProductCreate } from '~/schemas/product-schema';

export const getPaginatedProducts = (paginationOptions?: {
  page: number;
  limit: number;
}) => productRepository.getPaginatedProducts(paginationOptions);

export const createProduct = async (product: ProductCreate) => {
  const newProduct = await productRepository.createProduct(product);

  if (!newProduct.acknowledged) {
    throw new APIError(
      'Failed to create product',
      httpStatus.INTERNAL_SERVER_ERROR,
      true,
    );
  }

  return productRepository.getProductById(newProduct.insertedId);
};
