/**
 * 社区相关
 */
import {
    GET_MEMBER_FOLLOW,
    GET_DEFAULT_FOLLOW
} from './actionsTypes'


import communityService from "../services/communityService";


/**
 * 异步获取用户已经关注的社区
 */
export const getMemberFollowAsync = function () {
    return function (dispatch) {
        communityService.getMemberFollow()
            .then(function (data) {
                if (data.data) {
                    dispatch({
                        type: GET_MEMBER_FOLLOW,
                        data: data.data.groups,
                    });
                } else {
                    console.log(data);
                }
            });
    }
}


/**
 * 获取社区首页栏目
 */
export const getDefaultFollowAsync = function () {
    return function (dispatch) {
        communityService.getDefaultFollow()
            .then(function (data) {
                if (data.data) {
                    dispatch({
                        type: GET_DEFAULT_FOLLOW,
                        data: data.data,
                    });
                } else {
                    console.log(data);
                }
            }, () => {
                window.networkError('./images/networkError-icon.png') //获取栏目失败则显示网络错误
            });
    }
}

/**
 * 获取社区广告图
 */
export const getAdAsync = callback => dispatch => {
    communityService.getAd().then(res => {
        callback && callback(res);
    }, () => {
        //获取广告图失败
        callback && callback({
            code: 'fail',
            msg: '获取广告图失败'
        });
    });
}