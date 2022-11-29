import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Television } from './Television';
import { User } from './User';

@Entity()
export class Institution extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToMany(() => User, (user) => user.roles)
  @JoinTable({ name: 'institution_has_users' })
  users?: User[];

  @OneToMany(() => Television, (tv) => tv.institution)
  public televisions?: Television[];
}
