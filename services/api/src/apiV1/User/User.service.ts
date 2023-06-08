import { User } from '@src/entities/User';
import { BaseService } from '@lib/BaseClasses/BaseService';

export class UserSvc extends BaseService<User> {}

export const userSvc = new UserSvc(User);
