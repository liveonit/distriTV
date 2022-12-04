import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Television } from './Television';

@Entity()
export class Content extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: String;

  @Column()
  type!: String;

  @Column()
  duration!: number;

  @ManyToMany(() => Television, (tv) => tv.id)
  @JoinTable({ name: 'content_has_television'})
  televisions?: Television[];
}
