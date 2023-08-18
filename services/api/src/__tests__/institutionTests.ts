import request from 'supertest';

export const runInstitutionTests = (apiUrl: string) => {
  let token = '';
  let institutionId: number;
  beforeAll(async () => {
    const res = await request(apiUrl).post('/auth/login').set('auth-type', 'local').send({
      username: 'admin',
      password: '4dm1nP4ss',
    });
    token = `Bearer ${res.body.accessToken}`;
  });

  describe('🧪 CRUD tests for institution entity 🏢', () => {
    test('List institutions shoud work fine', async () => {
      const res = await request(apiUrl)
        .get('/institution')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(res.status).toBe(200);
      expect(res.body.find((entity: any) => entity.id === 1)).toEqual({
        id: 1,
        name: 'Ceibal',
        city: 'Montevideo',
        locality: 'Montevideo',
      });
    });

    test('Create institution shoud work fine', async () => {
      const inst = {
        name: 'InstitutionExample',
        city: 'CitiExample',
        locality: 'LocalityExample',
      };

      const firstRes = await request(apiUrl)
        .get('/institution')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(firstRes.status).toBe(200);

      const addRes = await request(apiUrl)
        .post('/institution')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send(inst);
      expect(addRes.status).toBe(200);
      expect(addRes.body).toEqual({
        id: addRes.body.id,
        ...inst,
      });
      institutionId = addRes.body.id

      const secRes = await request(apiUrl)
        .get('/institution')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(secRes.status).toBe(200);
      expect(secRes.body.length).toBe(firstRes.body.length + 1);
      expect(secRes.body.find((i: any) => i.id === addRes.body.id)).toEqual(addRes.body);
    });

    test('Update institution shoud work fine', async () => {
      const updatedInst = {
        name: 'UpdatedInstitutionExample',
        city: 'UpdatedCitiExample',
        locality: 'UpdatedLocalityExample',
      };

      const firstRes = await request(apiUrl)
        .get('/institution')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(firstRes.status).toBe(200);

      const updateRes = await request(apiUrl)
        .put(`/institution/${institutionId}`)
        .set('auth-type', 'local')
        .set('authorization', token)
        .send(updatedInst);
      expect(updateRes.status).toBe(200);
      expect(updateRes.body).toEqual({
        id: institutionId,
        ...updatedInst,
      });

      const secRes = await request(apiUrl)
        .get('/institution')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(secRes.status).toBe(200);
      expect(secRes.body.length).toBe(firstRes.body.length);
      expect(secRes.body.find((i: any) => i.id === updateRes.body.id)).toEqual(updateRes.body);
    });

    test('Delete institution shoud work fine', async () => {
      const firstRes = await request(apiUrl)
        .get('/institution')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(firstRes.status).toBe(200);

      const deleteRes = await request(apiUrl)
        .delete(`/institution/${institutionId}`)
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body).toEqual({ id: institutionId });

      const secRes = await request(apiUrl)
        .get('/institution')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(secRes.status).toBe(200);
      expect(secRes.body.length).toBe(firstRes.body.length - 1);
      expect(secRes.body.find((i: any) => i.id === deleteRes.body.id)).toBeUndefined();
    });
  });
};
