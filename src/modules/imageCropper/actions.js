import {
  IMAGE_CROPPER_ADD,
  IMAGE_CROPPER_UPDATE,
  IMAGE_CROPPER_DELETE
} from './actionTypes'

export const addImage = payload => ({ type: IMAGE_CROPPER_ADD, payload })
export const updateImage = (id = 0, updates) => ({
  type: IMAGE_CROPPER_UPDATE,
  id,
  updates
})
export const deleteImage = (id = 0) => ({
  type: IMAGE_CROPPER_DELETE,
  id
})
