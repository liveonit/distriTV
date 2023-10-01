import { RoleMapping } from 'validation/entities/RoleMapping';
import { BaseService } from 'lib/BaseClasses/BaseService';

export class RoleMappingSvc extends BaseService<RoleMapping> {}

export const roleMappingSvc = new RoleMappingSvc(RoleMapping);
