import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Television extends BaseEntity {
  @PrimaryGeneratedColumn()
  idTelevision!: number;

  @Column()
  ip!: String;

  @Column()
  mac!: String;

  @Column({ nullable: true })
  institution_idinstitution!: string;
}
