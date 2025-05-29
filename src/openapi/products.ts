import { z } from 'zod';

import { registry } from './registry';
import { insertProductSchema, selectProductSchema } from '~/schemas/products';
import {
  errorResponseSchema,
  successResponseSchema,
} from '~/schemas/responses';

// Register schemas
registry.register('SelectProduct', selectProductSchema);
registry.register('InsertProduct', insertProductSchema);

// Register POST /api/products
registry.registerPath({
  method: 'post',
  path: '/api/products',
  summary: 'Create a new product',
  request: {
    body: {
      content: {
        'application/json': {
          schema: insertProductSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Product created successfully',
      content: {
        'application/json': {
          schema: successResponseSchema(selectProductSchema),
        },
      },
    },
    400: {
      description: 'Validation error',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
  tags: ['Products'],
});

// Register GET /api/products
registry.registerPath({
  method: 'get',
  path: '/api/products',
  summary: 'Get all products',
  responses: {
    200: {
      description: 'List of products',
      content: {
        'application/json': {
          schema: successResponseSchema(z.array(selectProductSchema)),
        },
      },
    },
  },
  tags: ['Products'],
});
