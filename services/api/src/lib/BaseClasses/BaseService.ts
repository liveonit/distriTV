import { db, Db } from '@src/db';
import { BaseCustomEntity } from '@lib/BaseClasses/BaseCustomEntity';
import { NotFound } from '@lib/errors';
import _ from 'lodash';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, ObjectId, ObjectType } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class BaseService<T extends BaseCustomEntity> {
  protected readonly model: ObjectType<T>;
  protected readonly db: Db;
  constructor(model: ObjectType<T>) {
    this.model = model;
    this.db = db;
  }
  protected getEntity = () => this.db.getConnection().getRepository<T>(this.model);

  public readonly get = async (options?: FindOneOptions<T>) => {
    return this.getEntity().findOneOrFail({ ...options });
  };

  public readonly getMany = async (options?: FindManyOptions<T>) => {
    return (await this.getEntity().find(options)) as T[];
  };

  public readonly create = async (data: T, options?: FindOneOptions<T>) => {
    const { m2mRelations } = data as any;
    data = _.omit(data, ['m2mRelations']) as T;
    const entity = await this.getEntity().create(data).save();
    if (m2mRelations) {
      await Promise.all(
        Object.entries(m2mRelations).map(
          async ([relatedEntity, ids]) =>
            await this.getEntity()
              .createQueryBuilder()
              .relation(this.model, relatedEntity)
              .of(entity.id)
              .add(ids),
        ),
      );
    }
    return this.get({ ...options, where: { id: entity.id } as FindOptionsWhere<T> });
  };

  public readonly insertMany = async (entities: T[]) => {
    return this.db.getConnection().transaction('READ COMMITTED', async (em) => {
      const result = await em.insert<T>(this.model, entities as any[]);
      return await em.findBy<T>(this.model, result.identifiers as FindOptionsWhere<T>[]);
    });
  };

  public readonly delete = async <I extends string | number | ObjectId>(id: I) => {
    const result = await this.getEntity().delete(id);
    if (result.affected === 0) throw new NotFound();
    else return id;
  };

  public readonly update = async (
    id: string | number,
    data: Partial<T>,
    options?: FindOneOptions<T>,
  ) => {
    const { m2mRelations } = data as any;
    data = _.omit(data, ['m2mRelations']);
    const queryRunner = this.db.getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const queryBuilder = queryRunner.manager.createQueryBuilder();
    try {
      if (data && Object.keys(data).length)
        await queryRunner.manager.update(this.model, { id }, data as QueryDeepPartialEntity<T>);

      if (m2mRelations) {
        const updatedEntity = await queryRunner.manager.findOneOrFail(this.model, {
          where: { id } as FindOptionsWhere<T>,
          relations: [...Object.keys(m2mRelations || {})],
        });
        await Promise.all(
          Object.entries(m2mRelations).map(async ([relatedEntity, ids]) => {
            await queryBuilder
              .relation(this.model, relatedEntity.toLowerCase())
              .of(updatedEntity.id)
              .addAndRemove(ids, (updatedEntity as any)[relatedEntity.toLowerCase()] as any[]);
          }),
        );
      }
      await queryRunner.commitTransaction();
      return await queryRunner.manager.findOneOrFail(this.model, {
        ...options,
        where: { id } as FindOptionsWhere<T>,
      });
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  };
}
