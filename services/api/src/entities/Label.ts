import { Entity, BaseEntity, PrimaryGeneratedColumn, Column,ManyToMany , ManyToOne, ColumnTypeUndefinedError } from 'typeorm';
import { Television } from './Television';
import { Content } from './Content';


@Entity()
export class Label extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: String;

  @Column()
  description!: String;

  @ManyToMany(() => Television, (tv) => tv.id)
  tvs?: Television[];

  @ManyToMany(() => Content, (content) => content.id)
  content?: Content[];
}
