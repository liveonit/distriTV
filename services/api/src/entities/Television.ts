import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn
} from 'typeorm';
import { Institution } from './Institution';
import { Notification } from './Notification';
import { Label } from './Label';
import { Content } from './Content';

@Entity()
export class Television extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  institutionId!: number;

  @Column()
  ip!: String;

  @Column()
  mac!: String;

  @ManyToOne(() => Institution, (inst) => inst.televisions)
  @JoinColumn({ name: 'institutionId' })
  public institution?: Institution;

  @ManyToMany(() => Notification, (noti) => noti.id)
  @JoinTable({ name: 'television_has_notification' })
  notifications?: Notification[];

  @ManyToMany(() => Label, (lbl) => lbl.id)
  @JoinTable({ name: 'television_has_label' })
  labels?: Label[];

  @ManyToMany(() => Content, (cnt) => cnt.id) // Entidad fuerte TV por eso va acá.
  contents?: Content[];
}
