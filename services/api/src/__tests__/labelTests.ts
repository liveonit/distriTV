import request from 'supertest';
export const runLabelTests = (apiUrl: string) => {
  let token = '';

  beforeAll(async () => {
    const res = await request(apiUrl).post('/auth/login').set('auth-type', 'local').send({
      username: 'admin',
      password: '4dm1nP4ss',
    });
    token = `Bearer ${res.body.accessToken}`;
  });

  describe('🧪 CRUD tests for label entity 🏷️', () => {
    test('List label shoud work fine', async () => {
      const res = await request(apiUrl)
        .get('/label')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(0);
    });

    test('Create label shoud work fine', async () => {
      const label = {
        name: 'label example',
        description: 'some description',
      };

      const firstRes = await request(apiUrl)
        .get('/label')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(firstRes.status).toBe(200);
      expect(firstRes.body.length).toBe(0);

      const addRes = await request(apiUrl)
        .post('/label')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send(label);
      expect(addRes.status).toBe(200);
      expect(addRes.body).toEqual({
        id: addRes.body.id,
        ...label,
      });

      const secRes = await request(apiUrl)
        .get('/label')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(secRes.status).toBe(200);
      expect(secRes.body.length).toBe(firstRes.body.length + 1);
      expect(secRes.body.find((i: any) => i.id === addRes.body.id)).toEqual(addRes.body);
    });

    test('Update label shoud work fine', async () => {
      const updatedLabel = {
        name: 'updated label',
        description: 'updated description',
      };

      const firstRes = await request(apiUrl)
        .get('/label')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(firstRes.status).toBe(200);
      expect(firstRes.body.length).toBe(1);

      const updateRes = await request(apiUrl)
        .put('/label/1')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send(updatedLabel);
      expect(updateRes.status).toBe(200);
      expect(updateRes.body).toEqual({ id: 1, ...updatedLabel });

      const secRes = await request(apiUrl)
        .get('/label')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(secRes.status).toBe(200);
      expect(secRes.body.length).toBe(firstRes.body.length);
      expect(secRes.body.find((i: any) => i.id === updateRes.body.id)).toEqual(updateRes.body);
    });

    test('Delete label shoud work fine', async () => {
      const firstRes = await request(apiUrl)
        .get('/label')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(firstRes.status).toBe(200);
      expect(firstRes.body.length).toBe(1);

      const deleteRes = await request(apiUrl)
        .delete('/label/1')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body).toEqual({ id: 1 });

      const secRes = await request(apiUrl)
        .get('/label')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(secRes.status).toBe(200);
      expect(secRes.body.length).toBe(firstRes.body.length - 1);
      expect(secRes.body.find((i: any) => i.id === deleteRes.body.id)).toBeUndefined();
    });

    test('Associating/Disassociating label to tv should work fine', async () => {
      const label = {
        name: 'label to associtate',
        description: 'description of label to associate',
      };
      const createLabelRes = await request(apiUrl)
        .post('/label')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send(label);
      expect(createLabelRes.status).toBe(200);

      const television = {
        institutionId: 1,
        name: 'television example',
        tvCode: 'a1w2e3',
      };

      const createTelevisionRes = await request(apiUrl)
        .post('/television?relations=labels')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send(television);
      expect(createTelevisionRes.status).toBe(200);

      const addLabelRes = await request(apiUrl)
        .put(`/television/${createTelevisionRes.body.id}?relations=institution,labels`)
        .set('auth-type', 'local')
        .set('authorization', token)
        .send({
          id: createTelevisionRes.body.id,
          m2mRelations: { labels: [createLabelRes.body.id] },
        });
      expect(addLabelRes.status).toBe(200);
      expect(addLabelRes.body.labels.length).toBe(1);
      expect(addLabelRes.body.labels.find((l: any) => l.id === createLabelRes.body.id)).toEqual({
        id: createLabelRes.body.id,
        ...label,
      });

      const removeLabelRes = await request(apiUrl)
        .put(`/television/${createTelevisionRes.body.id}?relations=institution,labels`)
        .set('auth-type', 'local')
        .set('authorization', token)
        .send({
          id: createTelevisionRes.body.id,
          m2mRelations: { labels: [] },
        });
      expect(removeLabelRes.status).toBe(200);
      expect(removeLabelRes.body.labels.length).toBe(0);
    });
  });
};
