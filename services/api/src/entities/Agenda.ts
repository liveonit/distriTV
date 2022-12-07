import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Television } from './Television';
import { Content } from './Content';


@Entity({ name: 'content_has_television' })
export class Agenda extends BaseEntity {

  @PrimaryColumn()
  id!: number;

  @PrimaryColumn()
  contentId!: number;

  @PrimaryColumn()
  televisionId!: number;

  @PrimaryColumn()
  fechaInicioAgenda!: Date;

  @PrimaryColumn()
  fechaFinAgenda!: Date;

  
  @PrimaryColumn()
  cron!: string;

  @ManyToOne(() => Television, (tv) => tv.id)
  @JoinColumn({ name: 'roleId' })
  televisions!: Television;

  @ManyToOne(() => Content, (content) => content.id)
  @JoinColumn({ name: 'userId' })
  content!: Content;



}
