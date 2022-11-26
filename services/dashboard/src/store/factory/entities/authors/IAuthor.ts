import { Id } from '../../Generics'
import { IBook } from '../books/IBook'

export interface IAuthor {
  id: Id

  name: string

  country?: string

  age: number

  books?: IBook[]
}
