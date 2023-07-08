import { ContentActionTypes } from './content.state'
import { ContentT } from './content.type'
export const listContents = (payload?: { query?: string }) => ({
  type: ContentActionTypes.LIST_ALL_REQUEST,
  payload
})

export const createContent = (payload: ContentT) => ({
  type: ContentActionTypes.CREATE_REQUEST,
  payload,
})

export const uploadContent = (payload: ContentT) => ({
  type: ContentActionTypes.UPLOAD_FILE_REQUEST,
  payload,
})

export const deleteContent = (payload: { id: number | string }) => ({
  type: ContentActionTypes.DELETE_REQUEST,
  payload,
})
