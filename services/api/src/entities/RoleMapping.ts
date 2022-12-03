import { db } from '@src/db';
import { RoleMappingInput } from '@src/typeDefs/User';
import {
  BaseEntity,
  Column,
  Entity,
  In,
  JoinColumn,
  JoinTable,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Institution } from './Institution';
import { Permission } from './Permission';
import { Role } from './Role';
import { User } from './User';

@Entity({ name: 'user_has_roles' })
export class RoleMapping extends BaseEntity {
  @PrimaryColumn()
  userId!: string;

  @PrimaryColumn()
  roleId!: string;

  @PrimaryColumn()
  institutionId!: number;

  @OneToMany(() => Role, (role) => role.mapping)
  @JoinColumn({ name: 'roleId' })
  role!: Role;

  @OneToMany(() => User, (user) => user.roleMappings)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @OneToMany(() => Institution, (inst) => inst.team)
  @JoinColumn({ name: 'institutionId' })
  institution!: Institution;

}
