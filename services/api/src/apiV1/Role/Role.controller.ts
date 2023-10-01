import { Role } from 'validation/entities/Role';
import { BaseController } from 'lib/BaseClasses/BaseController';
import { querySchema } from 'lib/BaseClasses/QueryType';
import { RoleSvc, roleSvc } from './Role.service';
import { createRoleBody } from 'validation/entities';
import { updateRoleBody } from 'validation/entities';

class RoleController extends BaseController<Role, RoleSvc> { }

export const roleController = new RoleController(
  roleSvc,
  createRoleBody,
  updateRoleBody,
  undefined,
  querySchema,
);
