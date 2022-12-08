import { BaseCustomEntity } from '@src/utils/BaseClasses/BaseCustomEntity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Institution } from './Institution';
import { Role } from './Role';
import { User } from './User';

@Entity({ name: 'user_has_roles' })
export class RoleMapping extends BaseCustomEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  userId!: string;

  @Column()
  roleId!: string;

  @Column()
  institutionId!: number;

  @ManyToOne(() => Role, (role) => role.mapping)
  @JoinColumn({ name: 'roleId' })
  role!: Role;

  @ManyToOne(() => User, (user) => user.roleMappings)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Institution, (inst) => inst.team)
  @JoinColumn({ name: 'institutionId' })
  institution!: Institution;

}
