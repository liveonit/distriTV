import { RoleMapping } from '@src/entities/RoleMapping';
import { BaseController } from '@lib/BaseClasses/BaseController';
import { querySchema } from '@lib/BaseClasses/QueryType';
import { RoleMappingSvc, roleMappingSvc } from './RoleMapping.service';
import { createRoleMappingBody } from './types/CreateRoleMappingBody';
import { updateRoleMappingBody } from './types/UpdateRoleMappingBody';

class RoleMappingController extends BaseController<RoleMapping, RoleMappingSvc> {}

export const roleMappingController = new RoleMappingController(
  roleMappingSvc,
  createRoleMappingBody,
  updateRoleMappingBody,
  undefined,
  querySchema,
);
