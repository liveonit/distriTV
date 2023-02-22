import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, ColumnTypeUndefinedError } from 'typeorm';


@Entity()
export class Auditory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  user!: String;
  
  @Column()
  ipUser!: String;

  @Column()
  action!: String;

  @Column()
  date!: Date;

  
}
