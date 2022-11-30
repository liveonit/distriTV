import { Entity, BaseEntity, PrimaryGeneratedColumn, Column,ManyToMany , ManyToOne, ColumnTypeUndefinedError } from 'typeorm';
import { Television } from './Television';


@Entity()
export class Label extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  description!: String;
    
  @ManyToMany(() => Television, (tv) => tv.id) // Entidad fuerte TV por eso va acá.
  tvs?: Television[];
    

}
