import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Television } from './Television';
import { Label } from './Label';

@Entity()
export class Content extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: String;

  @Column()
  url!: string;

  @Column()
  type!: string;

  @Column()
  text!: string;

  @ManyToMany(() => Television, (tv) => tv.id)
  @JoinTable({ name: 'schedule'})
  televisions?: Television[];
}
