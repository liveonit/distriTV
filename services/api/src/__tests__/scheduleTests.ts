import _ from 'lodash';
import request, { Response } from 'supertest';

export const runScheduleTests = (apiUrl: string) => {
  let token = '';
  let scheduleId: number;
  let contentRes: Response, labelRes: Response, tvRes: Response, institutionRes: Response, addLabelRes: Response;

  beforeAll(async () => {
    const res = await request(apiUrl).post('/auth/login').set('auth-type', 'local').send({
      username: 'admin',
      password: '4dm1nP4ss',
    });
    token = `Bearer ${res.body.accessToken}`;
  });

  describe('🧪 CRUD tests for schedule entity ⏱️ ', () => {

    test('All nedded entities should be created', async () => {
      const inst = {
        name: 'institution example in schedule',
        city: 'schedule example in schedule',
        locality: 'locality example in schedule',
      };
      institutionRes = await request(apiUrl)
        .post('/institution')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send(inst);
      expect(institutionRes.status).toBe(200);

      const television = {
        institutionId: institutionRes.body.id,
        name: 'television example in schedule',
        tvCode: "schabc",
      };
      tvRes = await request(apiUrl)
        .post('/television')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send(television);
      expect(tvRes.status).toBe(200);

      const label = {
        name: 'label example in schedule',
        description: 'some description',
      };
      labelRes = await request(apiUrl)
        .post('/label')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send(label);
      expect(labelRes.status).toBe(200);


      const content = {
        name: "content test in schedule",
        type: "text",
        text: "Some text to show",
        duration: 30,
      };
      contentRes = await request(apiUrl)
        .post('/content')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send(content);
      expect(contentRes.status).toBe(200);


      addLabelRes = await request(apiUrl)
        .put(`/television/${tvRes.body.id}?relations=institution,labels`)
        .set('auth-type', 'local')
        .set('authorization', token)
        .send({
          id: tvRes.body.id,
          m2mRelations: { labels: [labelRes.body.id] },
        });

    })

    test('List schedules shoud work fine', async () => {
      const res = await request(apiUrl)
        .get('/schedule')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(res.status).toBe(200);
    })

    test('Create schedule (content to TV) shoud work fine', async () => {
      const schedule = {
        contentId: contentRes.body.id,
        televisionId: tvRes.body.id,
        destinationType: "TELEVISION",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 1000 * 60 * 24 * 7).toISOString(),
        cron: "0 30 * ? * FRI,MON,WED"
      };
      const firstRes = await request(apiUrl)
        .post(`/television/${tvRes.body.tvCode}/schedules`)
        .send({});
      expect(firstRes.status).toBe(200);


      const addRes = await request(apiUrl)
        .post('/schedule')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send(schedule);
      expect(addRes.status).toBe(200);
      expect(_.pick(addRes.body, ["televisionId", "contentId", "cron"])).toEqual(_.pick(schedule, ["televisionId", "contentId", "cron"]));

      scheduleId = addRes.body.id

      const secRes = await request(apiUrl)
        .post(`/television/${tvRes.body.tvCode}/schedules`)
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(secRes.status).toBe(200);
      expect(secRes.body.schedules.length).toBe(firstRes.body.schedules.length + 1);
      expect(_.pick(secRes.body.schedules.find((sch: any) => sch.id === scheduleId), ["televisionId", "contentId", "cron"])).toEqual(_.pick(schedule, ["televisionId", "contentId", "cron"]));
    });

    test('Update schedule shoud work fine', async () => {
      const updatedCont = {
        startDate: "2023-08-17T16:34:44.000Z",
        endDate: "2023-08-17T19:22:44.000Z",
        cron: "0 30 * ? * *"
      };

      const firstRes = await request(apiUrl)
        .get('/schedule')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(firstRes.status).toBe(200);

      const updateRes = await request(apiUrl)
        .put(`/schedule/${scheduleId}`)
        .set('auth-type', 'local')
        .set('authorization', token)
        .send(updatedCont);
      expect(updateRes.status).toBe(200);
      expect(updateRes.body).toEqual({
        contentId: contentRes.body.id,
        "cron": "0 30 * ? * *",
        "destinationType": "TELEVISION",
        "endDate": "2023-08-17T19:22:44.000Z",
        "id": scheduleId,
        "labelId": null,
        "startDate": "2023-08-17T16:34:44.000Z",
        "televisionId": tvRes.body.id,
      });

      const secRes = await request(apiUrl)
        .get('/schedule')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(secRes.status).toBe(200);
      expect(secRes.body.length).toBe(firstRes.body.length);
      expect(secRes.body.find((i: any) => i.id === updateRes.body.id)).toEqual(updateRes.body);
    });

    test('Delete schedule shoud work fine', async () => {
      const firstRes = await request(apiUrl)
        .get('/schedule')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(firstRes.status).toBe(200);
      expect(firstRes.body.length).toBe(1);

      const deleteRes = await request(apiUrl)
        .delete(`/schedule/${scheduleId}`)
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body).toEqual({ id: 1 });

      const secRes = await request(apiUrl)
        .get('/schedule')
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(secRes.status).toBe(200);
      expect(secRes.body.length).toBe(firstRes.body.length - 1);
      expect(secRes.body.find((i: any) => i.id === deleteRes.body.id)).toBeUndefined();

      const schRes = await request(apiUrl)
        .post(`/television/${tvRes.body.tvCode}/schedules`)
        .set('auth-type', 'local')
        .set('authorization', token)
        .send();
      expect(schRes.status).toBe(200);
      expect(schRes.body.schedules.find((sch: any) => sch.id === scheduleId)).toBeUndefined();

    });
  });
};
