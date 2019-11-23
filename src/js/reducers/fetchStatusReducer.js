/**
 * 各种网络请求的状态
 */
import {
    CHANGE_FETCH_STATUS_POSTS,
    NETWORK_ERROR,
} from "../actions/actionsTypes"

export default function FetchStatusReducer(state = {}, action) {
    switch (action.type) {
        case CHANGE_FETCH_STATUS_POSTS:
            return Object.assign({}, state, { ["postFetching"]: action.data });
        case NETWORK_ERROR:
            return Object.assign({}, state, { ["networkError"]: action.data });
        default:
            return state
    }
}