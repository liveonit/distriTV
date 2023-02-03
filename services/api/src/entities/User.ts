import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';


import { RoleMapping } from './RoleMapping';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  password?: string;

  @Column({ type: 'enum', enum: ['local', 'google']})
  loginType?: 'local' | 'google';

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

  @OneToMany(() => RoleMapping, (role) => role.user)
  roleMappings?: RoleMapping[];
}
