import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Television } from './Television';
import { Content } from './Content';


@Entity({ name: 'content_has_television' })
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

  @ManyToOne(() => Content, (content) => content.id)
  @JoinColumn({ name: 'contentId' })
  content!: Content;



}
