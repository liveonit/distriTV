import { Id } from '../../Generics'
import { IAuthor } from '../authors/IAuthor'

export interface IBook {
  id: Id
  title: string
  isPublished?: boolean
  authorId: number
  author?: IAuthor
}


