import { getEntities } from './common';
import { ProductDb, transformProductDbToApi } from '~/schemas/products';

export const getProducts = async (options?: {
  page: number;
  limit: number;
}) => {
  const data = await getEntities<ProductDb>('products', options);

  return {
    products: data.entities.map(transformProductDbToApi),
    pagination: {
      limit: data.limit,
      page: data.page,
      total: data.total,
    },
  };
};
