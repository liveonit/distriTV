import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Institution } from './Institution';

@Entity()
export class Television extends BaseEntity {
  @PrimaryGeneratedColumn()
  idTelevision!: number;

  @Column()
  ip!: String;

  @Column()
  mac!: String;

  @ManyToOne(() => Institution, (inst) => inst.televisions)
  public institution?: Institution;
}
