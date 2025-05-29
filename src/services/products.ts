import { getProducts as getProductsRepo } from '~/repositories/products';

export const getProducts = (options?: { page: number; limit: number }) =>
  getProductsRepo(options);
