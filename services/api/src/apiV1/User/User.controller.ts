import { User } from "@src/entities/User";
import BaseController from "@src/utils/BaseClasses/BaseController";
import { querySchema } from "@src/utils/BaseClasses/QueryType";
import { UserSvc, userSvc } from "./User.service";
import { createUserBody } from "./types/CreateUserBody";
import { updateUserBody } from "./types/UpdateUserBody";
import { userResponseBody } from "./types/UserResponseBody";

class UserController extends BaseController<User, UserSvc> {}

export const userController = new UserController(userSvc, createUserBody, updateUserBody, userResponseBody, querySchema)
