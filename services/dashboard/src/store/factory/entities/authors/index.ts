import { IAuthor } from './IAuthor'
import { createEntity } from '../../utils/createEntity'

const author = createEntity<IAuthor>('author')
export default author
