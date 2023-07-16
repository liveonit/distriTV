import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
  OneToMany,
  OneToOne
} from 'typeorm';
import { Institution } from './Institution';
import { Notification } from './Notification';
import { Label } from './Label';
import { Schedule } from './Schedule';
import { Alert } from './Alert';
import { Monitor } from './Monitor';

@Entity()
export class Television extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  institutionId!: number;

  @Column()
  ip!: string;

  @Column()
  mac!: string;

  @Column()
  tvCode!: string;

  @ManyToOne(() => Institution, (institution) => institution.televisions)
  @JoinColumn({ name: 'institutionId' })
  public institution?: Institution;

  @ManyToMany(() => Notification, (notification) => notification.televisions)
  @JoinTable({ name: 'television_has_notification' })
  notifications?: Notification[];

  @ManyToMany(() => Label, (label) => label.tvs)
  @JoinTable({ name: 'television_has_label' })
  labels?: Label[];

  @OneToMany(() => Schedule, (schedule) => schedule.television)
  schedules?: Schedule[];

  @OneToOne(() => Alert, (alert) => alert.television)
  @JoinColumn()
  alert?: Alert | null;

  @OneToOne(() => Monitor, (monitor) => monitor.television)
  @JoinColumn()
  monitor?: Monitor;
}
