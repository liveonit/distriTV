import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, ColumnTypeUndefinedError, ManyToMany } from 'typeorm';
import { Television } from './Television';


@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  mensaje!: String;
  
  @Column()
  titulo!: String;

  @ManyToMany(() => Television, (tv) => tv.id) // Entidad fuerte TV por eso va acá.
  tvs?: Television[];
    
}
