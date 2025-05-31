import request from 'supertest';

import { app } from '~/config/app';

describe('Health Check', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/health-check');
    expect(res.status).toBe(200);
  });
});
