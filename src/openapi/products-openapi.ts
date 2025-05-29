import { z } from 'zod';

import { registry } from './openapi-registry';
import {
  productCreateSchema,
  productReadSchema,
} from '~/schemas/product-schema';
import {
  errorResponseSchema,
  successResponseSchema,
} from '~/schemas/response-schema';
import { generateZodValidationErrorExample } from '~/utils/generate-validation-error-example';

// Register schemas
registry.register('ProductReadSchema', productReadSchema);
registry.register('ProductCreateSchema', productCreateSchema);

// Register POST /api/products
registry.registerPath({
  method: 'post',
  path: '/api/products',
  summary: 'Create a new product',
  request: {
    body: {
      content: {
        'application/json': {
          schema: productCreateSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Product created successfully',
      content: {
        'application/json': {
          schema: successResponseSchema(productReadSchema),
        },
      },
    },
    400: {
      description: 'Validation error',
      content: {
        'application/json': {
          schema: errorResponseSchema,
          examples: {
            invalidInsert: {
              summary: 'Invalid productCreateSchema example',
              value: generateZodValidationErrorExample(productCreateSchema),
            },
          },
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
          schema: successResponseSchema(z.array(productReadSchema)),
        },
      },
    },
  },
  tags: ['Products'],
});
