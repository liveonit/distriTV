import { Entity, BaseEntity, PrimaryGeneratedColumn, Column,ManyToMany , ManyToOne, ColumnTypeUndefinedError } from 'typeorm';
import { Television } from './Television';
import { Content } from './Content';
import { Schedule } from './Schedule';


@Entity()
export class Label extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: String;

  @Column()
  description!: String;

  @ManyToMany(() => Television, (tv) => tv.labels)
  tvs?: Television[];

  @ManyToMany(() => Schedule, (schedule) => schedule.label)
  schedules?: Schedule[];
}
