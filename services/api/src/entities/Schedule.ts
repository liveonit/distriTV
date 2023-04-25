import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Television } from './Television';
import { Content } from './Content';
import { Label } from './Label';

@Entity()
export class Schedule extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @PrimaryColumn()
  contentId!: number;

  @PrimaryColumn()
  labelId?: number;

  @PrimaryColumn()
  televisionId?: number;

  @PrimaryColumn()
  startDate!: Date;

  @PrimaryColumn()
  endDate!: Date;

  @PrimaryColumn()
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

