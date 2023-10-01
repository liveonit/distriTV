import { Institution } from 'validation/entities/Institution';
import { BaseService } from 'lib/BaseClasses/BaseService';
import { db } from '@src/db';

export class InstitutionSvc extends BaseService<Institution> {}

export const institutionSvc = new InstitutionSvc(Institution, db);
