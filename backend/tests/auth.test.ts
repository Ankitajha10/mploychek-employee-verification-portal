import request from 'supertest';
import { createApp } from '../src/app';
import { setupTestDB } from './setup';

const app = createApp();

describe('Authentication API (/api/auth)', () => {
  setupTestDB();

  it('should successfully log in an Admin with valid credentials and ADMIN role', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'Admin@123',
        role: 'ADMIN'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.username).toBe('admin');
    expect(res.body.data.user.role).toBe('ADMIN');
  });

  it('should successfully log in a General User with valid credentials and GENERAL_USER role', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'ankita',
        password: 'User@123',
        role: 'GENERAL_USER'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.role).toBe('GENERAL_USER');
  });

  it('should reject login when user attempts to select unauthorized role (ankita requesting ADMIN)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'ankita',
        password: 'User@123',
        role: 'ADMIN' // Role mismatch!
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Role authorization mismatch');
  });

  it('should reject login with invalid password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'ankita',
        password: 'WrongPassword@123',
        role: 'GENERAL_USER'
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should retrieve profile with valid JWT via GET /api/auth/me', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'ankita',
        password: 'User@123',
        role: 'GENERAL_USER'
      });

    const token = loginRes.body.data.token;

    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.data.username).toBe('ankita');
  });
});
