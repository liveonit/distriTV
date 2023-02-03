import { BaseCustomEntity } from '@src/utils/BaseClasses/BaseCustomEntity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleMapping } from './RoleMapping';
import { Television } from './Television';

@Entity()
export class Institution extends BaseCustomEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true})
  city?: string;

  @Column({ nullable: true })
  locality?: string;

  @OneToMany(() => RoleMapping, rm => rm.institution)
  public team?: RoleMapping[];

  @OneToMany(() => Television, (tv) => tv.institution)
  public televisions?: Television[];
}
