import request from 'supertest';

export const runContentTests = (apiUrl: string) => {
  let token = '';
  let contentId: number;
  beforeAll(async () => {
    const res = await request(apiUrl).post('/auth/login').set('auth-type', 'local').send({
      username: 'admin',
      password: '4dm1nP4ss',
    });
    token = `Bearer ${res.body.accessToken}`;
  });

  describe('🧪 CRUD tests for content entity ▶️ ', () => {
    test('List contents shoud work fine', async () => {
      const res = await request(apiUrl)
        .get('/content')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(res.status).toBe(200);
    })

    test('Create content shoud work fine', async () => {
      const content = {
        name: "content test",
        type: "text",
        text: "Some text to show",
        duration: 30,
      };
      const firstRes = await request(apiUrl)
        .get('/content')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(firstRes.status).toBe(200);

      const addRes = await request(apiUrl)
        .post('/content')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send(content);
      expect(addRes.status).toBe(200);
      expect(addRes.body).toEqual({
        id: addRes.body.id,
        ...content,
        url: null
      });
      contentId = addRes.body.id

      const secRes = await request(apiUrl)
        .get('/content')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(secRes.status).toBe(200);
      expect(secRes.body.length).toBe(firstRes.body.length + 1);
      expect(secRes.body.find((i: any) => i.id === addRes.body.id)).toEqual(addRes.body);
    });

    test('Update content shoud work fine', async () => {
      const updatedCont = {
        name: "upated content test",
        type: "text",
        text: "Some updated text to show",
        duration: 45,
      };

      const firstRes = await request(apiUrl)
        .get('/content')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(firstRes.status).toBe(200);

      const updateRes = await request(apiUrl)
        .put(`/content/${contentId}`)
        .set('auth-type', 'local')
        .set('authorization', token)
        .send(updatedCont);
      expect(updateRes.status).toBe(200);
      expect(updateRes.body).toEqual({
        id: updateRes.body.id,
        ...updatedCont,
        url: null
      });

      const secRes = await request(apiUrl)
        .get('/content')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(secRes.status).toBe(200);
      expect(secRes.body.length).toBe(firstRes.body.length);
      expect(secRes.body.find((i: any) => i.id === updateRes.body.id)).toEqual(updateRes.body);
    });

    test('Delete content shoud work fine', async () => {
      const firstRes = await request(apiUrl)
        .get('/content')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(firstRes.status).toBe(200);

      const deleteRes = await request(apiUrl)
        .delete(`/content/${contentId}`)
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body).toEqual({ id: contentId });

      const secRes = await request(apiUrl)
        .get('/content')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(secRes.status).toBe(200);
      expect(secRes.body.length).toBe(firstRes.body.length - 1);
      expect(secRes.body.find((i: any) => i.id === deleteRes.body.id)).toBeUndefined();
    });
  });
};
