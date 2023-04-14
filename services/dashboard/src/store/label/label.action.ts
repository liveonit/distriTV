import { LabelActionTypes } from './label.state'
import { LabelT } from './label.type'

export const listLabels = () => ({
  type: LabelActionTypes.LIST_ALL_REQUEST,
})

export const createLabel = (payload: LabelT) => ({
  type: LabelActionTypes.CREATE_REQUEST,
  payload
})

export const updateLabel = (payload: LabelT) => ({
  type: LabelActionTypes.EDIT_REQUEST,
  payload
})

export const deleteLabel = (payload: { id: number | string }) => ({
  type: LabelActionTypes.DELETE_REQUEST,
  payload
})
