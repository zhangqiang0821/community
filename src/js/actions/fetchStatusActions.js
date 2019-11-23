/**
 * 各种网络请求的状态
 */
import {
    NETWORK_ERROR,
} from "../actions/actionsTypes"

export const networkError = data => ({ type: NETWORK_ERROR, data: data }) //网络错误 data: boolear值