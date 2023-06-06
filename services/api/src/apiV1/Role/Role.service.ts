import { Role } from '@src/entities/Role';
import { BaseService } from '@lib/BaseClasses/BaseService';

export class RoleSvc extends BaseService<Role> {}

export const roleSvc = new RoleSvc(Role);
