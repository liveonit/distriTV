import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  Column,
  PrimaryGeneratedColumn,
  OneToOne
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
  destinationType!: string

  @Column()
  text!: String;

  @Column()
  duration!: number;

  @Column()
  durationLeft?: number;

  @Column()
  started!: boolean;

  @ManyToOne(() => Label, (label) => label.alerts)
  @JoinColumn({ name: 'labelId' })
  label!: Label;

  @OneToOne(() => Television, (tv) => tv.alert)
  television?: Television | null
}

