import { ContentActionTypes } from './content.state'

export const listContents = () => ({
  type: ContentActionTypes.LIST_ALL_REQUEST,
})

export const createContent = (payload: { name: string; url: string, type: string }) => ({
  type: ContentActionTypes.CREATE_REQUEST,
  payload,
})

export const uploadContent = (payload: { name: string; type: string, file: File }) => ({
  type: ContentActionTypes.UPLOAD_FILE_REQUEST,
  payload,
})

export const deleteContent = (payload: { id: number | string }) => ({
  type: ContentActionTypes.DELETE_REQUEST,
  payload
})

