import { Permission } from 'validation/entities/Permission';
import { BaseController } from 'lib/BaseClasses/BaseController';
import { querySchema } from 'lib/BaseClasses/QueryType';
import { PermissionSvc, permissionSvc } from './Permission.service';
import { createPermissionBody } from 'validation/entities';
import { updatePermissionBody } from 'validation/entities';

class PermissionController extends BaseController<Permission, PermissionSvc> { }

export const permissionController = new PermissionController(
  permissionSvc,
  createPermissionBody,
  updatePermissionBody,
  undefined,
  querySchema,
);
