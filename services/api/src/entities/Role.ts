import { BaseCustomEntity } from '@src/utils/BaseCustomEntity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Permission } from './Permission';
import { RoleMapping } from './RoleMapping';

@Entity()
export class Role extends BaseCustomEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => RoleMapping, rm => rm.role)
  mapping!: RoleMapping[]

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    cascade: true,
  })
  @JoinTable()
  permissions?: Permission[];
}
