import { User } from '@src/entities/User';
import { BaseService } from '@lib/BaseClasses/BaseService';
import _ from 'lodash';
import { FindOneOptions, FindOptionsWhere } from 'typeorm';
import * as argon2 from 'argon2';
import { RoleMapping } from '@src/entities/RoleMapping';

export class UserSvc extends BaseService<User> {
  public override readonly create = async (data: User, options?: FindOneOptions<User>) => {
    const { m2mRelations, password } = data as any;
    data = _.omit(data, ['m2mRelations']) as User;
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

  public override readonly update = async (
    id: string | number,
    data: Partial<User>,
    options?: FindOneOptions<User>,
  ) => {
    const { m2mRelations, password } = data as any;
    if (password) data.password = await argon2.hash(password);
    data = _.omit(data, ['m2mRelations']) as User;
    const queryRunner = this.db.getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(this.model, { id }, data);

      const { roleMappings } = m2mRelations.find((obj: any) => !!obj.roleMappings);
      if (roleMappings) {
        const updatedEntity = await queryRunner.manager.findOneOrFail(this.model, {
          where: { id } as FindOptionsWhere<User>,
          relations: ['roleMappings'],
        });
        const rolesToAdd = roleMappings.filter(
          (roleMapping: RoleMapping) =>
            !updatedEntity.roleMappings?.find((currentRM) =>
              _.isEqual(
                _.pick(roleMapping, ['userId', 'roleId', 'institutionId']),
                _.pick(currentRM, ['userId', 'roleId', 'institutionId']),
              ),
            ),
        );

        const rolesToDelete = updatedEntity.roleMappings?.filter(
          (roleMapping) =>
            !roleMappings.find((currentRM: Partial<RoleMapping>) =>
              _.isEqual(
                _.pick(roleMapping, ['userId', 'roleId', 'institutionId']),
                _.pick(currentRM, ['userId', 'roleId', 'institutionId']),
              ),
            ),
        );

        if (rolesToDelete) await RoleMapping.delete(rolesToDelete.map((v) => v.id));
        if (rolesToAdd) await RoleMapping.save(rolesToAdd);
      }
      await queryRunner.commitTransaction();
      return await queryRunner.manager.findOneOrFail(this.model, {
        ...options,
        where: { id } as FindOptionsWhere<User>,
      });
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  };
}

export const userSvc = new UserSvc(User);
