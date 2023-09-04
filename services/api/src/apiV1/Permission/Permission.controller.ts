import { Permission } from '@src/entities/Permission';
import { BaseController } from '@lib/BaseClasses/BaseController';
import { querySchema } from '@lib/BaseClasses/QueryType';
import { PermissionSvc, permissionSvc } from './Permission.service';
import { createPermissionBody } from 'validation/src';
import { updatePermissionBody } from 'validation/src';

class PermissionController extends BaseController<Permission, PermissionSvc> { }

export const permissionController = new PermissionController(
  permissionSvc,
  createPermissionBody,
  updatePermissionBody,
  undefined,
  querySchema,
);
