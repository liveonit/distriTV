import { Institution } from '@src/entities/Institution';
import { BaseService } from '@src/utils/BaseClasses/BaseService';

export class InstitutionSvc extends BaseService<Institution> {}

export const institutionSvc = new InstitutionSvc(Institution);