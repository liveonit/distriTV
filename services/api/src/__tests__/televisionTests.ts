import request from 'supertest';
import _ from 'lodash';
export const runTelevisionTests = (apiUrl: string) => {
  let token = '';
  let tvId: number;
  const tvCode = "p0o9i8"

  beforeAll(async () => {
    const res = await request(apiUrl).post('/auth/login').set('auth-type', 'local').send({
      username: 'admin',
      password: '4dm1nP4ss',
    });
    token = `Bearer ${res.body.accessToken}`;
  });

  describe('🧪 CRUD tests for television entity 📺', () => {
    test('List television shoud work fine', async () => {
      const res = await request(apiUrl)
        .get('/television')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(res.status).toBe(200);
    });

    test('Create television shoud work fine', async () => {
      const television = {
        institutionId: 1,
        name: 'television example',
        tvCode
      };

      const firstRes = await request(apiUrl)
        .get('/television')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(firstRes.status).toBe(200);

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
      tvId = addRes.body.id

      const secRes = await request(apiUrl)
        .get('/television?relations=monitor')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(secRes.status).toBe(200);
      expect(secRes.body.length).toBe(firstRes.body.length + 1);
      expect(secRes.body.find((i: any) => i.id === addRes.body.id)).toEqual({
        ...addRes.body,
        ip: null,
        mac: null,
      });
    });

    test('Update television shoud work fine', async () => {
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

      const updateRes = await request(apiUrl)
        .put(`/television/${tvId}`)
        .set('auth-type', 'local')
        .set('authorization', token)
        .send(updatedTv);
      expect(updateRes.status).toBe(200);
      expect(updateRes.body).toEqual({
        id: tvId,
        institutionId: 1,
        mac: null,
        tvCode,
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

    test('Delete television shoud work fine', async () => {
      const firstRes = await request(apiUrl)
        .get('/television')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(firstRes.status).toBe(200);

      const deleteRes = await request(apiUrl)
        .delete(`/television/${tvId}`)
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body).toEqual({ id: tvId });

      const secRes = await request(apiUrl)
        .get('/television')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(secRes.status).toBe(200);
      expect(secRes.body.length).toBe(firstRes.body.length - 1);
      expect(secRes.body.find((i: any) => i.id === tvId)).toBeUndefined();
    });
  });
};
