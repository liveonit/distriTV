import { User } from '@src/entities/User';
import { BaseController } from '@lib/BaseClasses/BaseController';
import { querySchema } from '@lib/BaseClasses/QueryType';
import { UserSvc, userSvc } from './User.service';
import { createUserBody } from 'validation/src';
import { updateUserBody } from 'validation/src';
import { userResponseBody } from 'validation/src';

class UserController extends BaseController<User, UserSvc> {}

export const userController = new UserController(
  userSvc,
  createUserBody,
  updateUserBody,
  userResponseBody,
  querySchema,
);
