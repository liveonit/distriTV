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
import { Schedule } from './Schedule';

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

  @Column()
  duration!: number;

  @ManyToMany(() => Schedule, (schedule) => schedule.id)
  @JoinTable({ name: 'schedule'})
  schedules?: Schedule[];
}
