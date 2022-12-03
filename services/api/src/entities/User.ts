import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';


import { RoleMapping } from './RoleMapping';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  password?: string;

  @Column()
  enabled!: boolean;

  @Column()
  emailVerified!: boolean;

  @Column()
  firstName?: string;

  @Column()
  lastName?: string;

  @Column()
  email?: string;

  @ManyToOne(() => RoleMapping, (role) => role.user)
  roleMappings?: RoleMapping[];
}
