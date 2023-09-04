import { Role } from '@src/entities/Role';
import { BaseController } from '@lib/BaseClasses/BaseController';
import { querySchema } from '@lib/BaseClasses/QueryType';
import { RoleSvc, roleSvc } from './Role.service';
import { createRoleBody } from 'validation/src';
import { updateRoleBody } from 'validation/src';

class RoleController extends BaseController<Role, RoleSvc> { }

export const roleController = new RoleController(
  roleSvc,
  createRoleBody,
  updateRoleBody,
  undefined,
  querySchema,
);
