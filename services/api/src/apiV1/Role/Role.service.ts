import { Role } from '@src/entities/Role';
import { BaseService } from '@src/utils/BaseClasses/BaseService';

export class RoleSvc extends BaseService<Role> {}

export const roleSvc = new RoleSvc(Role);
