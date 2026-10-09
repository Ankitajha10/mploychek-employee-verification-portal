import request from 'supertest';
import { createApp } from '../src/app';
import { setupTestDB } from './setup';

const app = createApp();

describe('Role-Based Authorization & Users API (/api/users)', () => {
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

  it('should return 401 Unauthorized when accessing /api/users with no token', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(401);
  });

  it('should return 403 Forbidden when General User attempts to access Admin-only /api/users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Access denied');
  });

  it('should return 200 OK when Admin accesses /api/users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(2);
  });

  it('should allow Admin to create a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'New Trainee',
        username: 'trainee',
        email: 'trainee@test.com',
        role: 'GENERAL_USER',
        department: 'Operations',
        employeeId: 'EMP-TR-999',
        status: 'ACTIVE'
      });

    expect(res.status).toBe(201);
    expect(res.body.data.username).toBe('trainee');
  });

  it('should allow Admin to deactivate a user (DELETE /api/users/:id)', async () => {
    // First get the user ID for ankita
    const usersRes = await request(app)
      .get('/api/users?search=ankita')
      .set('Authorization', `Bearer ${adminToken}`);

    const ankitaId = usersRes.body.data[0]._id;

    const deleteRes = await request(app)
      .delete(`/api/users/${ankitaId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.data.status).toBe('INACTIVE');
  });
});
