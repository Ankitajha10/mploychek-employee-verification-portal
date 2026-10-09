import request from 'supertest';
import { createApp } from '../src/app';
import { setupTestDB } from './setup';

const app = createApp();

describe('Employment Records API (/api/records)', () => {
  setupTestDB();

  let adminToken: string;
  let userToken: string;

  beforeEach(async () => {
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'Admin@123', role: 'ADMIN' });
    adminToken = adminLogin.body.data.token;

    const userLogin = await request(app)
      .post('/api/auth/login')
      .send({ username: 'ankita', password: 'User@123', role: 'GENERAL_USER' });
    userToken = userLogin.body.data.token;
  });

  it('should return ONLY own records for General User', async () => {
    const res = await request(app)
      .get('/api/records')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].company).toBe('Test Corp A');
  });

  it('should return all records for Admin', async () => {
    const res = await request(app)
      .get('/api/records')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(2);
  });

  it('should respect the async delay query parameter (?delay=100)', async () => {
    const startTime = Date.now();

    const res = await request(app)
      .get('/api/records?delay=100')
      .set('Authorization', `Bearer ${userToken}`);

    const elapsed = Date.now() - startTime;

    expect(res.status).toBe(200);
    expect(elapsed).toBeGreaterThanOrEqual(80); // Allowed slight jitter in timers
  });
});
