import { User } from '@src/entities/User';
import { BaseService } from '@lib/BaseClasses/BaseService';
import _ from 'lodash';
import { FindOneOptions, FindOptionsWhere } from 'typeorm';
import * as argon2 from 'argon2';
import { RoleMapping } from '@src/entities/RoleMapping';

export class UserSvc extends BaseService<User> {
  public override readonly create = async (data: User, options?: FindOneOptions<User>) => {
    const { m2mRelations, password } = data as any;
    data = _.omit(data, ['m2mRelations', 'password']) as User;
    const entity = await this.getEntity()
      .create({ ...data, password: await argon2.hash(password) })
      .save();
    const { roleMappings } = m2mRelations.find((obj: any) => !!obj.roleMappings);
    if (roleMappings)
      await RoleMapping.save(
        roleMappings.map((roleMap: any) => ({ ...roleMap, userId: entity.id })),
      );
    return _.omit(
      await this.get({ ...options, where: { id: entity.id } as FindOptionsWhere<User> }),
      'password',
    );
  };
}

export const userSvc = new UserSvc(User);
