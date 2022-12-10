import { ContentActionTypes } from './content.state'

export const listContents = () => ({
  type: ContentActionTypes.LIST_ALL_REQUEST,
})

export const createContent = (payload: { name: string; url: string, type: string }) => ({
  type: ContentActionTypes.CREATE_REQUEST,
  payload,
})
