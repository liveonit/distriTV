import { Permission } from '@src/entities/Permission';
import { BaseService } from '@lib/BaseClasses/BaseService';

export class PermissionSvc extends BaseService<Permission> {}

export const permissionSvc = new PermissionSvc(Permission);
