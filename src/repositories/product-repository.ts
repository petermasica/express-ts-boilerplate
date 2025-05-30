import type { ObjectId } from 'mongodb';

import {
  createEntity,
  getEntitiesPaginated,
  getOneEntityById,
} from './base-repository';
import {
  ProductCreate,
  ProductRead,
  productReadSchema,
} from '~/schemas/product-schema';

const productReadProjectionKeys = Object.keys(productReadSchema.shape);

export const createProduct = (product: ProductCreate) =>
  createEntity<ProductCreate>('products', product);

export const getPaginatedProducts = async (paginationOptions?: {
  page: number;
  limit: number;
}) => {
  const data = await getEntitiesPaginated<ProductRead>(
    'products',
    paginationOptions,
  );

  return {
    products: data.entities,
    pagination: {
      limit: data.limit,
      page: data.page,
      total: data.total,
    },
  };
};

export const getProductById = (id: ObjectId) => {
  return getOneEntityById<ProductRead>(
    'products',
    id,
    productReadProjectionKeys,
  );
};
