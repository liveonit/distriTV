import { Permission } from 'validation/entities/Permission';
import { BaseService } from 'lib/BaseClasses/BaseService';

export class PermissionSvc extends BaseService<Permission> {}

export const permissionSvc = new PermissionSvc(Permission);
