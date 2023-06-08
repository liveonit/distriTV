import { Institution } from '@src/entities/Institution';
import { BaseService } from '@lib/BaseClasses/BaseService';

export class InstitutionSvc extends BaseService<Institution> {}

export const institutionSvc = new InstitutionSvc(Institution);
