import { ContentT } from '../content/content.type'

export type TelevisionT = {
  id: number
  ip: string
  mac: string
  notifications?: Notification[]
  televisions?: TelevisionT[]
  contents?: ContentT[]
}
