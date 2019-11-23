/**
 * 导航
 */
import {
    GET_DEFAULT_FOLLOW, 
} from "../../actions/actionsTypes"

export default function navigationReducer(state = [], action) {
	switch (action.type) {
		case GET_DEFAULT_FOLLOW:
			return action.data;
    	default:
			return state
  }
}