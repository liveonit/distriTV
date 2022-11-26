import { IBook } from './IBook'
import { createEntity } from '../../utils/createEntity'

const book = createEntity<IBook>('book')
export default book
