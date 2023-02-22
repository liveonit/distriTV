import { Permission } from "@src/entities/Permission";
import BaseController from "@src/utils/BaseClasses/BaseController";
import { querySchema } from "@src/utils/BaseClasses/QueryType";
import { PermissionSvc, permissionSvc } from "./Permission.service";
import { createPermissionBody } from "./types/CreatePermissionBody";
import { updatePermissionBody } from "./types/UpdatePermissionBody";

class PermissionController extends BaseController<Permission, PermissionSvc> {}

export const permissionController = new PermissionController(permissionSvc, createPermissionBody, updatePermissionBody, undefined, querySchema)
