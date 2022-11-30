import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Institution } from './Institution';
import { Notification } from './Notification';
import { Label } from './Label';
import { Content } from './Content';

@Entity()
export class Television extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  ip!: String;

  @Column()
  mac!: String;

  @ManyToOne(() => Institution, (inst) => inst.televisions)
  public institution?: Institution;



    @ManyToMany(() => Notification, (noti) => noti.id)
    @JoinTable()
    notis?: Notification[]

    @ManyToMany(() => Label, (lbl) => lbl.id)
    @JoinTable()
    labels?: Label[]

    @ManyToMany(() => Content, (cnt) => cnt.id) // Entidad fuerte TV por eso va acá.
    cnts?: Content[];
      


}
