import { RoleMapping } from 'validation/entities/RoleMapping';
import { BaseController } from 'lib/BaseClasses/BaseController';
import { querySchema } from 'lib/BaseClasses/QueryType';
import { RoleMappingSvc, roleMappingSvc } from './RoleMapping.service';
import { createRoleMappingBody } from 'validation/entities';
import { updateRoleMappingBody } from 'validation/entities';

class RoleMappingController extends BaseController<RoleMapping, RoleMappingSvc> {}

export const roleMappingController = new RoleMappingController(
  roleMappingSvc,
  createRoleMappingBody,
  updateRoleMappingBody,
  undefined,
  querySchema,
);
