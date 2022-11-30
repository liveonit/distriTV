import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, JoinTable ,ManyToOne, ManyToMany } from 'typeorm';
import { Television } from './Television';


@Entity()
export class Content extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: String;
  
  @Column()
  tipo!: String;

  @Column()
  duracion!: number;


    @ManyToMany(() => Television, (tv) => tv.id)
    @JoinTable()
    tvs?: Television[]

}
