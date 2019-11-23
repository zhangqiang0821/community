/**
 * 评论回复列表
 */
import {
    GET_REPLY,
} from "../actions/actionsTypes"

export default function PostsReducer(state = {}, action) {
    switch (action.type) {
        case GET_REPLY:
            //  return Object.assign({}, state, { [action.commentId]:state[action.commentId]?[...state[action.commentId],...action.data]:action.data });
            return Object.assign({}, state, { [action.commentId]: action.data });
        default:
            return state
    }
}