import { Product } from './products.schema';
import { getDb } from '~/config/db';

export const Products = () => getDb().collection<Product>('products');
