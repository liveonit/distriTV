import { Institution } from '@src/entities/Institution';
import { BaseService } from '@src/utils/BaseClasses/BaseService';

class InstitutionSvc extends BaseService<Institution> {}

export const institutionSvc = new InstitutionSvc(BaseService);
