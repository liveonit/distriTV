import { User } from '@src/entities/User';
import { BaseService } from '@src/utils/BaseClasses/BaseService';

export class UserSvc extends BaseService<User> {}

export const userSvc = new UserSvc(User);
