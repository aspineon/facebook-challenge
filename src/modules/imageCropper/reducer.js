import {
  IMAGE_CROPPER_ADD,
  IMAGE_CROPPER_UPDATE,
  IMAGE_CROPPER_DELETE
} from './actionTypes'

const imageCropperReducerDefaultState = []

const imageCropper = (state = imageCropperReducerDefaultState, action) => {
  switch (action.type) {
    case IMAGE_CROPPER_ADD:
      return [...state, action.payload]
    case IMAGE_CROPPER_UPDATE:
      return state.map((item, key) => {
        if (key === action.id) {
          return {
            ...item,
            ...action.updates
          }
        }
        return item
      })
    case IMAGE_CROPPER_DELETE:
      return state.filter((item, key) => key !== action.id)
    default:
      return state
  }
}

export default imageCropper
