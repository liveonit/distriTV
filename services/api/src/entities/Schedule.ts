import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { Television } from './Television';
import { Content } from './Content';
import { Label } from './Label';

export class Schedule extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @PrimaryColumn()
  contentId!: number;

  @PrimaryColumn()
  televisionId!: number;

  @PrimaryColumn()
  startDate!: Date;

  @PrimaryColumn()
  endDate!: Date;

  @PrimaryColumn()
  cron!: string;

  @ManyToOne(() => Television, (tv) => tv.id)
  @JoinColumn({ name: 'televisionId' })
  televisions!: Television;

  @ManyToOne(() => Label, (label) => label.id)
  @JoinColumn({ name: 'labelId' })
  label!: Label;

  @ManyToOne(() => Content, (content) => content.id)
  @JoinColumn({ name: 'contentId' })
  content!: Content;

}

