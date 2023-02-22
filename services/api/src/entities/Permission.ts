import { BaseCustomEntity } from '@src/utils/BaseClasses/BaseCustomEntity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './Role';

@Entity()
export class Permission extends BaseCustomEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles?: Role[];
}
