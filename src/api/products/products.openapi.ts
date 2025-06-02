import { z } from 'zod';

import {
  productParamsSchema,
  productQuerySchema,
  productSchema,
  productWithIdSchema,
} from './products.schema';
import { registry } from '~/openapi/openapi-registry';
import {
  errorResponseSchema,
  successResponseSchema,
} from '~/shared/schemas/response.schema';

// Register POST /api/products
registry.registerPath({
  method: 'post',
  path: '/api/products',
  summary: 'Create a new product',
  request: {
    body: {
      content: {
        'application/json': {
          schema: productSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Product created successfully',
      content: {
        'application/json': {
          schema: successResponseSchema(productWithIdSchema),
        },
      },
    },
    400: {
      description: 'Missing product attributes',
      content: {
        'application/json': {
          schema: errorResponseSchema,
          example: {
            status: 'error',
            error: {
              message: 'Validation failed',
              details: [
                {
                  field: 'price',
                  reason: 'Required',
                },
                {
                  field: 'inStock',
                  reason: 'Required',
                },
              ],
            },
          },
        },
      },
    },
  },
  tags: ['Products'],
});

registry.registerPath({
  method: 'get',
  path: '/api/products/{id}',
  summary: 'Get product by ID',
  request: {
    params: productParamsSchema,
  },
  responses: {
    200: {
      description: 'Product found',
      content: {
        'application/json': {
          schema: successResponseSchema(productWithIdSchema),
          example: {
            status: 'success',
            data: {
              id: '60c72b2f9b1e8b6f8f0e4d3a',
              name: 'Product Alpha',
              description: 'High quality product for everyday use.',
              price: 29.99,
              inStock: true,
            },
            message: 'Product fetched successfully',
          },
        },
      },
    },
    400: {
      description: 'Invalid product ID format',
      content: {
        'application/json': {
          schema: errorResponseSchema,
          example: {
            status: 'error',
            error: {
              message: 'Validation failed',
              details: [
                {
                  field: 'id',
                  reason: 'Invalid ObjectId',
                },
              ],
            },
          },
        },
      },
    },
    404: {
      description: 'Product not found',
      content: {
        'application/json': {
          schema: errorResponseSchema,
          example: {
            status: 'error',
            error: {
              message: 'Product with id 683af0bb55e7012f678483d4 not found',
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
  request: {
    query: productQuerySchema,
  },
  responses: {
    200: {
      description: 'List of products',
      content: {
        'application/json': {
          schema: successResponseSchema(z.array(productWithIdSchema)),
          examples: {
            products: {
              summary: 'Products found',
              value: {
                status: 'success',
                data: [
                  {
                    id: '60c72b2f9b1e8b6f8f0e4d3a',
                    name: 'Product Alpha',
                    description: 'High quality product for everyday use.',
                    price: 29.99,
                    inStock: true,
                  },
                  {
                    id: '60c72b2f9b1e8b6f8f0e4d3b',
                    name: 'Product Beta',
                    description: 'Another great product.',
                    price: 19.99,
                    inStock: false,
                  },
                ],
                message: 'Products fetched successfully',
                meta: {
                  pagination: {
                    page: 1,
                    limit: 10,
                    total: 2,
                  },
                },
              },
            },
            noProducts: {
              summary: 'No products found',
              value: {
                status: 'success',
                data: [],
                message: 'Products fetched successfully',
                meta: {
                  pagination: {
                    page: 1,
                    limit: 10,
                    total: 0,
                  },
                },
              },
            },
          },
        },
      },
    },
    400: {
      description: 'Invalid query parameters',
      content: {
        'application/json': {
          schema: errorResponseSchema,
          example: {
            status: 'error',
            error: {
              message: 'Validation failed',
              details: [
                {
                  field: 'page',
                  reason: 'Number must be greater than or equal to 1',
                },
                {
                  field: 'limit',
                  reason: 'Number must be less than or equal to 50',
                },
              ],
            },
          },
        },
      },
    },
  },
  tags: ['Products'],
});
