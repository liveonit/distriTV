import { User } from '@src/entities/User';
import { BaseService } from '@lib/BaseClasses/BaseService';
import _ from 'lodash';
import { FindOneOptions, FindOptionsWhere, In } from 'typeorm';
import * as argon2 from 'argon2';
import { RoleMapping } from '@src/entities/RoleMapping';
import { Role } from '@src/entities/Role';
import { createUserBody, CreateUserBodyType } from 'validation/src';
import { updateUserBody } from 'validation/src';

export class UserSvc extends BaseService<User> {
  public override readonly create = async (data: User, options?: FindOneOptions<User>) => {
    const userBody = createUserBody.parse(data);
    const { m2mRelations, password } = userBody;
    data = _.omit(data, ['m2mRelations']) as User;
    const entity = await this.getEntity()
      .create({ ...data, password: await argon2.hash(password) })
      .save();
    const { roleMappings } = m2mRelations.find((obj: any) => !!obj.roleMappings) || {};
    if (roleMappings) {
      const roles = await Role.find({
        where: { name: In(roleMappings.map((rm) => rm.roleName)) },
      });
      await RoleMapping.save(
        roles.map(
          (role, idx) =>
            ({
              roleId: role.id,
              userId: entity.id,
              institutionId: roleMappings[idx].institutionId,
            } as RoleMapping),
        ),
      );
    }
    return _.omit(
      await this.get({ ...options, where: { id: entity.id } as FindOptionsWhere<User> }),
      'password',
    );
  };

  public override readonly update = async (
    id: string | number,
    data: Partial<User>,
    options?: FindOneOptions<User>,
  ) => {
    const { m2mRelations, password } = updateUserBody.parse(data);
    if (password) data.password = await argon2.hash(password);
    data = _.omit(data, ['m2mRelations']) as User;
    const queryRunner = this.db.getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.findOneOrFail(this.model, {
        where: { id } as FindOptionsWhere<User>,
        relations: ['roleMappings'],
      });
      if (user.loginType === 'local') await queryRunner.manager.update(this.model, { id }, data);

      const { roleMappings } = m2mRelations?.find((obj) => !!obj.roleMappings) || {};

      if (roleMappings) {
        const role = await Role.findOneOrFail({ where: { name: roleMappings[0].roleName } });
        if (user.roleMappings?.length)
          await queryRunner.manager.update(RoleMapping, user.roleMappings[0].id, {
            roleId: role.id,
            institutionId: roleMappings[0].institutionId,
          } as RoleMapping);
        else
          await queryRunner.manager.save(RoleMapping, {
            roleId: role.id,
            userId: id,
            institutionId: roleMappings[0].institutionId,
          } as RoleMapping);
      }
      await queryRunner.commitTransaction();
      return await queryRunner.manager.findOneOrFail(this.model, {
        ...options,
        where: { id } as FindOptionsWhere<User>,
      });
    } catch (err) {
      logger.error(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  };
}

export const userSvc = new UserSvc(User);
