import { Router } from 'express';

import * as productHandlers from './products.handlers';
import { paramsWithIdSchema, productSchema } from './products.schema';
import { validateRequest } from '~/middleware/request-validation';

const router = Router();

router.post(
  '/',
  validateRequest({ body: productSchema }),
  productHandlers.createOne,
);

router.get('/', productHandlers.findAll);

router.get(
  '/:id',
  validateRequest({ params: paramsWithIdSchema }),
  productHandlers.findOne,
);

export default router;
