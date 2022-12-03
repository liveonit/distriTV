import { BaseCustomEntity } from '@src/utils/BaseCustomEntity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Book } from './Book';

@Entity()
export class Author extends BaseCustomEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  country?: string;

  @Column()
  age!: number;

  @OneToMany(() => Book, (book) => book.author)
  public books?: Book[];
}
