/**
 * 帖子
 */
import {
    POSTS_IS_END, //列表已经没有更多数据了
} from "../../actions/actionsTypes"

export default function PostsReducer(state = {}, action) {
    switch (action.type) {
        case POSTS_IS_END:
            return Object.assign({}, state, action.data);
        default:
            return state
    }
}