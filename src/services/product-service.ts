import * as productRepository from '~/repositories/product-repository';

export const getProducts = (options?: { page: number; limit: number }) =>
  productRepository.getPaginatedProducts(options);
