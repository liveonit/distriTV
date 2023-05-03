import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, ColumnTypeUndefinedError, ManyToMany } from 'typeorm';
import { Television } from './Television';


@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  message!: String;

  @Column()
  title!: String;

  @ManyToMany(() => Television, (tv) => tv.notifications) // Entidad fuerte TV por eso va acá.
  televisions?: Television[];
}
