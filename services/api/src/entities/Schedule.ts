import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  Column,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Television } from './Television';
import { Content } from './Content';
import { Label } from './Label';

@Entity()
export class Schedule extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  destinationType!: string

  @Column()
  contentId!: number;

  @Column()
  labelId?: number;

  @Column()
  televisionId?: number;

  @Column()
  startDate!: Date;

  @Column()
  endDate!: Date;

  @Column()
  cron!: string;

  @ManyToOne(() => Television, (tv) => tv.schedules)
  @JoinColumn({ name: 'televisionId' })
  television!: Television;

  @ManyToOne(() => Label, (label) => label.schedules)
  @JoinColumn({ name: 'labelId' })
  label!: Label;

  @ManyToOne(() => Content, (content) => content.schedules)
  @JoinColumn({ name: 'contentId' })
  content!: Content;

}

