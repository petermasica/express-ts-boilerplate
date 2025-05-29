import { getEntitiesPaginated } from './base-repository';
import { ProductDb, transformProductDbToApi } from '~/schemas/product-schema';

export const getPaginatedProducts = async (options?: {
  page: number;
  limit: number;
}) => {
  const data = await getEntitiesPaginated<ProductDb>('products', options);

  return {
    products: data.entities.map(transformProductDbToApi),
    pagination: {
      limit: data.limit,
      page: data.page,
      total: data.total,
    },
  };
};
