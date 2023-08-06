import request from 'supertest';

export const runAuthTests = (apiUrl: string) => {
  let token = '';
  describe('👉👉👉 Api tests 👈👈👈', () => {
    describe('🧪 Rest API status and not found error ❤️‍🩹', () => {
      test('Db and Redis connections should be working fine ', async () => {
        const res = await request(apiUrl).get('/health').send();
        expect(res.status).toEqual(200);
        expect(res.body.dbStatus).toBe('Connected');
        expect(res.body.dbMigrations).toBe("There aren't pending migrations");
        expect(res.body.redisStatus).toBe('Connected');
      });

      test('Invalid path should return 404', async () => {
        const res = await request(apiUrl).get('/invalid_path').send();
        expect(res.status).toEqual(404);
        expect(res.body.error.message).toBe('Resource not found');
        expect(res.body.error.code).toBe(404);
        expect(res.body.error.success).toBeFalsy();
      });
    });

    describe('🧪 Login user flows 🔐', () => {
      test('Login with invalid credentials should return unauthorized', async () => {
        const res = await request(apiUrl).post('/auth/login').set('auth-type', 'local').send({
          username: 'a@b.com',
          password: '123123123',
        });
        expect(res.status).toBe(401);
        expect(res.body.error.type).toBe('UNAUTHORIZED');
        expect(res.body.error.message).toBe('Invalid Credentials');
        expect(res.body.error.code).toBe(401);
        expect(res.body.error.success).toBeFalsy();
      });

      test('Login with empty credentials should return unauthorized', async () => {
        const res = await request(apiUrl).post('/auth/login').set('auth-type', 'local').send({});
        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe(400);
        expect(res.body.error.message).toBeDefined();
        expect(
          res.body.error.errors[0].path[0] === 'username' &&
            res.body.error.errors[0].message === 'Required',
        ).toBeTruthy();
        expect(
          res.body.error.errors[1].path[0] === 'password' &&
            res.body.error.errors[1].message === 'Required',
        ).toBeTruthy();
      });

      test('Login should work fine and return the tokens', async () => {
        const res = await request(apiUrl).post('/auth/login').set('auth-type', 'local').send({
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
        const res = await request(apiUrl).get('/auth/me').set('auth-type', 'local').send();
        expect(res.status).toBe(401);
        expect(res.body.error.type).toBe('UNAUTHORIZED');
        expect(res.body.error.message).toBe('Invalid Credentials');
        expect(res.body.error.code).toBe(401);
        expect(res.body.error.success).toBeFalsy();
      });

      test('Get profile should work fine', async () => {
        const res = await request(apiUrl)
          .get('/auth/me')
          .set('auth-type', 'local')
          .set('authorization', token)
          .send();
        expect(res.status).toBe(200);
        expect(res.body.id).toBeDefined();
        expect(res.body.firstName).toBe('admin');
        expect(res.body.lastName).toBe('user');
        expect(res.body.email).toBe('admin@example.com');
      });
    });
  });

  return token;
};
