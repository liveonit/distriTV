import { Role } from "@src/entities/Role";
import BaseController from "@src/utils/BaseClasses/BaseController";
import { querySchema } from "@src/utils/BaseClasses/QueryType";
import { RoleSvc, roleSvc } from "./Role.service";
import { createRoleBody } from "./types/CreateRoleBody";
import { updateRoleBody } from "./types/UpdateRoleBody";

class RoleController extends BaseController<Role, RoleSvc> {}

export const roleController = new RoleController(roleSvc, createRoleBody, updateRoleBody, undefined, querySchema)
