import { combineReducers } from 'redux'
import followReducer from './followReducer'
import navigationReducer from './navigationReducer';

const communityReducers = combineReducers({
  follows: followReducer,
  navigation:navigationReducer
})

export default communityReducers