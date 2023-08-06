import request from 'supertest';
import _ from 'lodash';
export const runTelevisionTests = (apiUrl: string) => {
  let token = '';

  beforeAll(async () => {
    const res = await request(apiUrl).post('/auth/login').set('auth-type', 'local').send({
      username: 'admin',
      password: '4dm1nP4ss',
    });
    token = `Bearer ${res.body.accessToken}`;
  });

  describe('CRUD tests for television entity', () => {
    test('List television shoud work fine', async () => {
      const res = await request(apiUrl)
        .get('/television')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(0);
    });

    test('Create television shoud work fine', async () => {
      const television = {
        institutionId: 1,
        name: 'television example',
        tvCode: 'a1w2e3',
      };

      const firstRes = await request(apiUrl)
        .get('/television')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(firstRes.status).toBe(200);
      expect(firstRes.body.length).toBe(0);

      const addRes = await request(apiUrl)
        .post('/television')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send(television);
      expect(addRes.status).toBe(200);
      expect(_.pick(addRes.body, ['id', 'institutionId', 'name', 'tvCode'])).toEqual({
        id: addRes.body.id,
        ...television,
      });
      expect(addRes.body.monitor).toBeDefined();

      const secRes = await request(apiUrl)
        .get('/television')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(secRes.status).toBe(200);
      expect(secRes.body.length).toBe(firstRes.body.length + 1);
      expect(
        _.pick(
          secRes.body.find((i: any) => i.id === addRes.body.id),
          ['id', 'institutionId', 'name', 'tvCode'],
        ),
      ).toEqual(_.pick(addRes.body, ['id', 'institutionId', 'name', 'tvCode']));
    });

    test('Update institution shoud work fine', async () => {
      const updatedTv = {
        name: 'updated television example',
        ip: '192.168.0.1',
      };

      const firstRes = await request(apiUrl)
        .get('/television')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(firstRes.status).toBe(200);
      expect(firstRes.body.length).toBe(1);

      const updateRes = await request(apiUrl)
        .put('/television/1')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send(updatedTv);
      expect(updateRes.status).toBe(200);
      expect(updateRes.body).toEqual({
        id: 1,
        institutionId: 1,
        mac: null,
        tvCode: 'a1w2e3',
        ...updatedTv,
      });

      const secRes = await request(apiUrl)
        .get('/television')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(secRes.status).toBe(200);
      expect(secRes.body.length).toBe(firstRes.body.length);
      expect(secRes.body.find((i: any) => i.id === updateRes.body.id)).toEqual(updateRes.body);
    });

    test('Delete institution shoud work fine', async () => {
      const firstRes = await request(apiUrl)
        .get('/television')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(firstRes.status).toBe(200);
      expect(firstRes.body.length).toBe(1);

      const deleteRes = await request(apiUrl)
        .delete('/television/1')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body).toEqual({ id: 1 });

      const secRes = await request(apiUrl)
        .get('/television')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(secRes.status).toBe(200);
      expect(secRes.body.length).toBe(firstRes.body.length - 1);
      expect(secRes.body.find((i: any) => i.id === deleteRes.body.id)).toBeUndefined();
    });
  });
};
