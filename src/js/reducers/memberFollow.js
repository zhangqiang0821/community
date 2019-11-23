import {
	SET_MEMBER_FOLLOW
} from 'app/actions/actionsTypes'

export default function memberFollow(state = [], action){
	switch(action.type) {
		case SET_MEMBER_FOLLOW:
			return action.data
		default:
			return state;
	}
}