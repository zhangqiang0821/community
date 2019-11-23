import { combineReducers } from 'redux'
import commentReducer from './commentReducer'
import totalReducer from './totalReducer';

const communityReducers = combineReducers({
  total: totalReducer,
  comments:commentReducer
})

export default communityReducers