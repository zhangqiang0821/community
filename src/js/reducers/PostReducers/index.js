import { combineReducers } from 'redux'
import PostsReducer from './PostsReducer'

const communityReducers = combineReducers({
  posts: PostsReducer
})

export default communityReducers