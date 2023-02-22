import { RoleMapping } from '@src/entities/RoleMapping';
import { BaseService } from '@src/utils/BaseClasses/BaseService';

export class RoleMappingSvc extends BaseService<RoleMapping> {}

export const roleMappingSvc = new RoleMappingSvc(RoleMapping);
