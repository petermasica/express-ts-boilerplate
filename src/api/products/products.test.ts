import request from 'supertest';

import { productWithIdSchema } from '~/api/products/products.schema';
import { app } from '~/config/app';
import {
  errorResponseSchema,
  successResponseSchema,
} from '~/shared/schemas/response.schema';

describe('POST /api/products', () => {
  it('should create a new product and return 201 with product data', async () => {
    const product = {
      name: 'Test Product',
      description: 'A product for testing',
      price: 42.5,
      inStock: true,
    };

    const response = await request(app)
      .post('/api/products')
      .send(product)
      .expect(201);

    const resBody = successResponseSchema(productWithIdSchema).parse(
      response.body,
    );

    expect(resBody).toMatchObject({
      status: 'success',
      data: {
        ...product,
        id: expect.any(String), // Assuming ID is generated and returned
      },
      message: 'Product created successfully',
    });
  });

  it('should return 400 if required fields are missing', async () => {
    const response = await request(app)
      .post('/api/products')
      .send({})
      .expect(400);

    const resBody = errorResponseSchema.parse(response.body);

    expect(resBody.status).toBe('error');
    expect(resBody.error).toBeDefined();
    expect(resBody.error.message).toBe('Validation failed');
    expect(resBody.error.details).toEqual([
      { field: 'name', reason: 'Required' },
      { field: 'description', reason: 'Required' },
      { field: 'price', reason: 'Required' },
      { field: 'inStock', reason: 'Required' },
    ]);
  });
});

describe('GET /api/products', () => {
  it('should return 200 and a list of products', async () => {
    const product = {
      name: 'Test Product',
      description: 'A product for testing',
      price: 42.5,
      inStock: true,
    };

    await request(app).post('/api/products').send(product).expect(201);

    const response = await request(app).get('/api/products').expect(200);

    const resBody = successResponseSchema(productWithIdSchema.array()).parse(
      response.body,
    );

    expect(resBody).toMatchObject({
      status: 'success',
      data: [
        {
          ...product,
          id: expect.any(String),
        },
      ],
      message: 'Products fetched successfully',
      meta: {
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
        },
      },
    });
  });

  it('should return an empty array if there are no products', async () => {
    const response = await request(app).get('/api/products').expect(200);

    const resBody = successResponseSchema(productWithIdSchema.array()).parse(
      response.body,
    );

    expect(resBody).toMatchObject({
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
    });
  });

  it('should return paginated products with custom page and limit', async () => {
    const product = {
      name: 'Test Product',
      description: 'A product for testing',
      price: 42.5,
      inStock: true,
    };

    // Create 15 products
    for (let i = 1; i <= 15; i++) {
      await request(app)
        .post('/api/products')
        .send({ ...product, name: `${product.name} ${i}` })
        .expect(201);
    }

    const response = await request(app)
      .get('/api/products?page=2&limit=5')
      .expect(200);

    const resBody = successResponseSchema(productWithIdSchema.array()).parse(
      response.body,
    );

    expect(resBody.status).toBe('success');
    expect(resBody.data.length).toBe(5);
    expect(resBody.data[0].name).toContain('Test Product 6'); // First product on page 2
    expect(resBody.data[4].name).toContain('Test Product 10'); // Last product on page 2
    expect(resBody.message).toBe('Products fetched successfully');
    expect(resBody.meta?.pagination).toEqual({
      page: 2,
      limit: 5,
      total: 15,
    });
  });

  it('should return 400 for invalid page or limit values', async () => {
    const response = await request(app)
      .get('/api/products?page=0&limit=100')
      .expect(400);

    const resBody = errorResponseSchema.parse(response.body);

    expect(resBody.status).toBe('error');
    expect(resBody.error).toBeDefined();
    expect(resBody.error.message).toBe('Validation failed');
    expect(resBody.error.details).toEqual(
      expect.arrayContaining([
        { field: 'page', reason: 'Number must be greater than or equal to 1' },
        { field: 'limit', reason: 'Number must be less than or equal to 50' },
      ]),
    );
  });
});

describe('GET /api/products/:id', () => {
  it('should return 200 and the product if it exists', async () => {
    const product = {
      name: 'Test Product',
      description: 'A product for testing',
      price: 42.5,
      inStock: true,
    };

    const createResponse = await request(app)
      .post('/api/products')
      .send(product)
      .expect(201);

    const createdProduct = successResponseSchema(productWithIdSchema).parse(
      createResponse.body,
    ).data;

    const response = await request(app)
      .get(`/api/products/${createdProduct.id}`)
      .expect(200);

    const resBody = successResponseSchema(productWithIdSchema).parse(
      response.body,
    );

    expect(resBody.status).toBe('success');
    expect(resBody.data).toMatchObject(product);
    expect(resBody.data.id).toBe(createdProduct.id);
    expect(resBody.message).toBe('Product fetched successfully');
  });

  it('should return 400 for invalid product id format', async () => {
    const response = await request(app)
      .get('/api/products/invalid-id')
      .expect(400);

    const resBody = errorResponseSchema.parse(response.body);

    expect(resBody.status).toBe('error');
    expect(resBody.error).toBeDefined();
    expect(resBody.error.message).toBe('Validation failed');
    expect(resBody.error.details).toEqual([
      { field: 'id', reason: 'Invalid ObjectId' },
    ]);
  });

  it('should return 404 if product does not exist', async () => {
    // Use a valid but non-existent ObjectId
    const nonExistentId = '60c72b2f9b1e8b6f8f0e4d3b';

    const response = await request(app)
      .get(`/api/products/${nonExistentId}`)
      .expect(404);

    const resBody = errorResponseSchema.parse(response.body);

    expect(resBody.status).toBe('error');
    expect(resBody.error).toBeDefined();
    expect(resBody.error.message).toBe(
      `Product with id ${nonExistentId} not found`,
    );
  });
});
