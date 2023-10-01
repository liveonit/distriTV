import { User } from 'validation/entities/User';
import { BaseController } from 'lib/BaseClasses/BaseController';
import { querySchema } from 'lib/BaseClasses/QueryType';
import { UserSvc, userSvc } from './User.service';
import { createUserBody } from 'validation/entities';
import { updateUserBody } from 'validation/entities';
import { userResponseBody } from 'validation/entities';

class UserController extends BaseController<User, UserSvc> {}

export const userController = new UserController(
  userSvc,
  createUserBody,
  updateUserBody,
  userResponseBody,
  querySchema,
);
