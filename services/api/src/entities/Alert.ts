import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  Column,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Television } from './Television';

import { Label } from './Label';

@Entity()
export class Alert extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;
 
  @Column()
  labelId?: number;

  @Column()
  televisionId?: number;

  @Column()
  startDate!: Date;

  @Column()
  text!: String;

  @Column()
  duration!: number;

  @ManyToOne(() => Television, (tv) => tv.alerts)
  @JoinColumn({ name: 'televisionId' })
  television!: Television;

  @ManyToOne(() => Label, (label) => label.alerts)
  @JoinColumn({ name: 'labelId' })
  label!: Label;


}

