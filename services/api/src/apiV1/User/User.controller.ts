import { User } from '@src/entities/User';
import { BaseController } from '@lib/BaseClasses/BaseController';
import { querySchema } from '@lib/BaseClasses/QueryType';
import { UserSvc, userSvc } from './User.service';
import { createUserBody } from './types/CreateUserBody';
import { updateUserBody } from './types/UpdateUserBody';
import { userResponseBody } from './types/UserResponseBody';

class UserController extends BaseController<User, UserSvc> {}

export const userController = new UserController(
  userSvc,
  createUserBody,
  updateUserBody,
  userResponseBody,
  querySchema,
);
