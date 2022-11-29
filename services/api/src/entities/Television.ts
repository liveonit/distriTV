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

  @ManyToOne(() => Institution, (institution) => institution.idInstitution)
  public institution?: Institution;

  @Column({ nullable: true })
  institucion_idInstitucion!: string;


}
