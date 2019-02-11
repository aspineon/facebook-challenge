import { ADD_POST, UPDATE_POST, LOAD_POSTS, DELETE_POST } from './actionTypes'

const postsReducerDefaultState = []

const posts = (state = postsReducerDefaultState, action) => {
  switch (action.type) {
    case LOAD_POSTS:
      return action.data
    case ADD_POST:
      return [action.newInstance, ...state]
    case UPDATE_POST:
      return state.map(post =>
        post.id === action.id
          ? {
              ...post,
              ...action.updates
            }
          : post
      )
    case DELETE_POST:
      return state.filter(post => post.id !== action.id)
    default:
      return state
  }
}

export default posts
