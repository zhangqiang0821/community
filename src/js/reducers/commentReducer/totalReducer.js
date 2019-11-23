/**
 * 评论数
 */
import {
    GET_COMMENTS_TOTAL,
    CREATE_COMMENT, //增加新评论
} from "../../actions/actionsTypes"

export default function PostsReducer(state = 0, action) {
    switch (action.type) {
        case GET_COMMENTS_TOTAL:
            return action.data;
        case CREATE_COMMENT:
            return (state * 1) + 1; //评论数加1
        default:
            return state
    }
}