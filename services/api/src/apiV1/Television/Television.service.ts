import { Television } from '@src/entities/Television';
import { BaseService } from '@src/utils/BaseClasses/BaseService';

export class TelevisionSvc extends BaseService<Television> {}

export const televisionSvc = new TelevisionSvc(Television);
