import { Router } from 'express';

import * as productHandlers from './products.handler';
import {
  productParamsSchema,
  productQuerySchema,
  productSchema,
} from './products.schema';
import { validateRequest } from '~/middleware/request-validation';

const router = Router();

router.post(
  '/',
  validateRequest({ body: productSchema }),
  productHandlers.createOne,
);

router.get(
  '/',
  validateRequest({ query: productQuerySchema }),
  productHandlers.findAll,
);

router.get(
  '/:id',
  validateRequest({ params: productParamsSchema }),
  productHandlers.findOne,
);

export default router;
