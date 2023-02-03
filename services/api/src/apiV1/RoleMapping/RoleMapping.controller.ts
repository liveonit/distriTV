import { RoleMapping } from "@src/entities/RoleMapping";
import BaseController from "@src/utils/BaseClasses/BaseController";
import { querySchema } from "@src/utils/BaseClasses/QueryType";
import { RoleMappingSvc, roleMappingSvc } from "./RoleMapping.service";
import { createRoleMappingBody } from "./types/CreateRoleMappingBody";
import { updateRoleMappingBody } from "./types/UpdateRoleMappingBody";

class RoleMappingController extends BaseController<RoleMapping, RoleMappingSvc> {}

export const roleMappingController = new RoleMappingController(roleMappingSvc, createRoleMappingBody, updateRoleMappingBody, undefined, querySchema)
