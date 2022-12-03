import { BaseCustomEntity } from '@src/utils/BaseCustomEntity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleMapping } from './RoleMapping';
import { Television } from './Television';
import { User } from './User';

@Entity()
export class Institution extends BaseCustomEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => RoleMapping, rm => rm.institution)
  public team?: RoleMapping[];

  @OneToMany(() => Television, (tv) => tv.institution)
  public televisions?: Television[];
}
