/**
 * 已关注的社区
 */
import {
    GET_MEMBER_FOLLOW, 
} from "../../actions/actionsTypes"

export default function followReducer(state = [], action) {
	switch (action.type) {
		case GET_MEMBER_FOLLOW:
			return action.data;
    	default:
			return state
  }
}