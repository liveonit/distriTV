import { config } from '../config';
import request from 'supertest';

const API_URL = `http://localhost:${config.API_PORT}${config.API_PREFIX}/${config.API_VERSION}`;

describe('👉👉👉 Api tests 👈👈👈', () => {
  describe('🧪 Rest API status and not found error ❤️‍🩹', () => {
    test('Db and Redis connections should be working fine ', async () => {
      const res = await request(API_URL).get('/health').send();
      expect(res.status).toEqual(200);
      expect(res.body.dbStatus).toBe('Connected');
      expect(res.body.dbMigrations).toBe("There aren't pending migrations");
      expect(res.body.redisStatus).toBe('Connected');
    });

    test('Invalid path should return 404', async () => {
      const res = await request(API_URL).get('/invalid_path').send();
      expect(res.status).toEqual(404);
      expect(res.body.error.type).toBe('NOT_FOUND');
      expect(res.body.error.message).toBe('Resource not found');
      expect(res.body.error.code).toBe(404);
      expect(res.body.error.success).toBeFalsy();
    });
  });

  describe('🧪 Login user flows 🔐', () => {
    let token: string;
    test('Login should return unauthorized', async () => {
      const res = await request(API_URL).post('/auth/login').set('auth-type', 'local').send({
        username: 'a@b.com',
        password: '123123123',
      });
      expect(res.status).toBe(401);
      expect(res.body.error.type).toBe('UNAUTHORIZED');
      expect(res.body.error.message).toBe('Invalid Credentials');
      expect(res.body.error.code).toBe(401);
      expect(res.body.error.success).toBeFalsy();
    });

    test('Login should work fine and return the tokens', async () => {
      const res = await request(API_URL).post('/auth/login').set('auth-type', 'local').send({
        username: 'admin',
        password: '4dm1nP4ss',
      });
      expect(res.status).toBe(200);
      expect(res.body.id).toBeDefined();
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
      token = `Bearer ${res.body.accessToken}`;
    });

    test('Get profile without token should return Unauthorized', async () => {
      const res = await request(API_URL).get('/auth/me').set('auth-type', 'local').send();
      expect(res.status).toBe(403);
      expect(res.body.error.type).toBe('FORBIDDEN');
      expect(res.body.error.message).toBe('Invalid Permissions');
      expect(res.body.error.code).toBe(403);
      expect(res.body.error.success).toBeFalsy();
    });

    test('Get profile should work fine', async () => {
      const res = await request(API_URL).get('/auth/me').set('auth-type', 'local').set('authorization', token).send();
      expect(res.status).toBe(200);
      expect(res.body.id).toBeDefined();
      expect(res.body.firstName).toBe('admin');
      expect(res.body.lastName).toBe('user');
      expect(res.body.email).toBe('admin@example.com');
    });
  });
});
