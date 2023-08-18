import { runInstitutionTests } from './institutionTests';
import { runTelevisionTests } from './televisionTests';
import { runAuthTests } from './authTests';
import { config } from '../config';
import request from 'supertest';

const API_URL = `http://localhost:${config.API_PORT}${config.API_PREFIX}/${config.API_VERSION}`;

runAuthTests(API_URL);
runInstitutionTests(API_URL);
runTelevisionTests(API_URL);
test('Clearing DB data', async () => {
  const res = await request(API_URL).get('/clear-db').send();
  expect(res.status).toBe(200);
});
