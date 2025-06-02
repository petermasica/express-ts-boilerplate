import { Router } from 'express';

import productsRouter from './products/products.routes';

const router = Router();

router.use('/products', productsRouter);

export default router;
