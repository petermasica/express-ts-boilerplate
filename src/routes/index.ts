import { Router } from 'express';

import { productsRouter } from './product-route';

const router = Router();

router.use('/products', productsRouter);

export const routes = router;
