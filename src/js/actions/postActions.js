/**
 * 帖子
 */
import {
    CHANGE_FETCH_STATUS_POSTS,
    GET_POSTS,
    GET_POST,
    REMOVE_POSTS_BY_GROUPID,
    PRAISE, //点赞
    DELETE_POST_BY_ID, //删除帖子
    DELETE_POSTS_LIST, //删除所有帖子列表数据
    DELETE_POST, //删除帖子
    IS_VOTE, //投票
    UP_POST, //更新帖子数据
    DELETE_POSTS_1, //删除最后一条资讯
    POSTS_IS_END, //列表已经没有更多数据了
} from './actionsTypes'
import { Toast } from 'antd-mobile'

import postService from "../services/postService";
import * as menus from './menus'

/**
 * 常用工具类
 */
import common from '../utils/common'
import userHelper from '../utils/userHelper'

export const praise = data => ({ type: PRAISE, data: data }) //点赞
export const deletePostById = data => ({ type: DELETE_POST_BY_ID, data: data }) //删除帖子
export const isVote = data => ({ type: IS_VOTE, data: data }) //投票
export const deletePostsList = () => ({ type: DELETE_POSTS_LIST }) //删除所有帖子列表数据
export const deletePost = () => ({ type: DELETE_POST }); //删除
export const upPost = data => ({ type: UP_POST, data: data }); //更新帖子数据
export const deletePosts1 = groupId => ({ type: DELETE_POSTS_1, groupId: groupId }); //删除最后一条资讯
export const changeFetchStatusPosts = data => ({ type: CHANGE_FETCH_STATUS_POSTS, data: data }); //网络请求状态
export const postsIsEnd = data => ({ type: POSTS_IS_END, data: data }); //列表已经没有更多数据了

/**
 * 获取所有 从APP view回来的时候，更新帖子数据
 */
export const upPostDates = data => {
    return dispatch => {
        Toast.hide(); //加载前 先关闭其他加载中的提示框 避免提示框一直存在的bug
        // Toast.loading("", 30, () => Toast.info("网络错误", 2));
        let postData = data;
        postService.getPostsInfo(data).then(data => {
            // Toast.hide();
            data.data.groupId = postData.groupId;
            data.data.postsId = postData.postsId;
            if (data.code == 1000) {
                dispatch(upPost(data.data));
            } else {
                if (data.code == 91119) {
                    //帖子不存在或已删除！
                    dispatch(deletePostById(postData)); //删除帖子
                }
            }
        }, () => {
            //接口请求出错了
        });
    }
}

/**
 * 异步获取帖子列表
 */
export const getPostsByGroupIdAsync = function (data) {
    let groupId = data.groupId;
    return function (dispatch) {

        dispatch(changeFetchStatusPosts(true)); //网络请求状态

        Toast.hide(); //加载前 先关闭其他加载中的提示框 避免提示框一直存在的bug
        Toast.loading("加载中...", 30, () => {
            dispatch(changeFetchStatusPosts(false));
            Toast.info("网络错误", 2)
        });

        let pageNo = data.pageNo; //页码
        let getMemberFollowAsync = false; //获取已关注社区
        if (data.groupId == '97' && data.pageNo == '1') {
            getMemberFollowAsync = true;
        }

        if (pageNo > 1) {
            Toast.hide(); //加载更多的时候 不需要显示加载中提示框
        }

        postService.getPostsByGroupId(data).then(data => {
            Toast.hide();
            if (data.code == 1000) {
                dispatch({
                    type: GET_POSTS,
                    data: data.data.list, //帖子列表
                    groupId: groupId,
                    pageNo: pageNo
                });
                dispatch(postsIsEnd({
                    [groupId]: data.data.isEnd
                }));

            } else {
                if (data.code != "90015") {
                    Toast.info(data.msg, 2);
                }else{
                    document.body.scrollTop = 0 //滚动到顶部，避免一直出现请用户登录
                }
            }
            dispatch(changeFetchStatusPosts(false));
        }, () => {
            dispatch(changeFetchStatusPosts(false));
            Toast.hide(); //隐藏Toast
            Toast.info("系统繁忙，请稍后再试");
        });
    }
}


/**
 * 异步获取帖子
 */
export const getPostByIdAsync = data => {
    return dispatch => {
        Toast.hide(); //加载前 先关闭其他加载中的提示框 避免提示框一直存在的bug
        Toast.loading("加载中...", 30, () => Toast.info("网络错误", 2));
        postService.getPostById(data).then(data => {
            Toast.hide();
            if (data.code == 1000) {
                dispatch({
                    type: GET_POST,
                    data: data.data
                });
            } else {
                Toast.info(data.msg, 2);
            }
        }, () => {
            Toast.hide(); //隐藏Toast
            Toast.info("系统繁忙，请稍后再试");
        });
    }
}

/**
 * 点赞 异步
 * {"userId": "13800138000"//用户id
 * ,"token": "ADJKSKJNKJASLKSKLS"//token
 * ,"groupId":"82345678"//社区id
 * ,"postsId":1//帖子ID
 * ,"ac_type":1//默认为空 4：帖子点赞 5：帖子取消点赞
 */
export const praiseAsync = function (data) {
    let userInfo = userHelper.getUserIdAndToken(); //获取用户信息
    if(!userInfo.userId || !userInfo.token){
        return userHelper.Login(); //需要先登录
    }
    let postData = data;
    return function (dispatch) {
        let needToUpdateData = {
            type: 'post', //路由名称
            data: postData
        }
        localStorage.setItem("needToUpdateData", JSON.stringify(needToUpdateData)); //需要更新指定数据
        dispatch(praise(postData)); //点赞 || 取消点赞  (暂时忽略点击成功与否，直接在数据返回之前触发UI效果)

        // Toast.hide(); //加载前 先关闭其他加载中的提示框 避免提示框一直存在的bug
        // Toast.loading("", 30, () => Toast.info("网络错误", 2));

        postService.praise(data).then(data => {
            console.log("点赞功能：", data)
            // Toast.hide();
            // if (data.code == 1000) {
            //     let needToUpdateData = {
            //         type: 'post', //路由名称
            //         data: postData
            //     }
            //     localStorage.setItem("needToUpdateData", JSON.stringify(needToUpdateData)); //需要更新指定数据
            //     dispatch(praise(postData)); //点赞 || 取消点赞
            // } else {
            //     if (data.code != "90015") {
            //         Toast.info(data.msg, 2);
            //     }
            // }
        }, () => {
            // Toast.hide(); //隐藏Toast
            // Toast.info("系统繁忙，请稍后再试");
        });
    }
}

/**
 * 删除帖子 异步
 * {"userId": "13800138000"//用户id
 * ,"token": "ADJKSKJNKJASLKSKLS"//token
 * ,"groupId":"82345678"//社区id
 * ,"postsId":1//帖子ID
 */
export const deletePostByIdAsync = function (data) {
    return function (dispatch) {
        Toast.loading("", 30, () => Toast.info("网络错误", 2));
        let postData = data;
        postService.deletePostById(data).then(data => {
            console.log("删除帖子", data)
            Toast.hide();
            if (data.code == 1000) {
                let needToUpdateData = {
                    type: 'post', //路由名称
                    data: postData
                }
                localStorage.setItem("needToUpdateData", JSON.stringify(needToUpdateData)); //需要更新指定数据
                try {
                    dispatch(deletePostById(postData)); //删除帖子
                } catch (e) { }

                common.closeAppView(); //页面后退
            } else {
                Toast.info(data.msg, 2);
            }
        }, () => {
            Toast.hide(); //隐藏Toast
            Toast.info("系统繁忙，请稍后再试");
        });
    }
}

/**
 * 投票 异步
 * {"userId": "13800138000"//用户id
 * ,"token": "ADJKSKJNKJASLKSKLS"//token
 * ,"groupId":"82345678"//社区id
 * ,"postsId":1//帖子ID
 * ,"voteId":选项ID
 */
export const voteAsync = function (data) {
    let userInfo = userHelper.getUserIdAndToken(); //获取用户信息
    if(!userInfo.userId || !userInfo.token){
        return userHelper.Login(); //需要先登录
    }
    return function (dispatch) {
        Toast.loading("", 30, () => Toast.info("网络错误", 2));
        let postData = {
            "groupId": data.groupId,
            "postsId": data.postsId,
            "Step": 2
        };
        postService.vote(data).then(data => {
            console.log("投票", data)
            Toast.hide();
            if (data.code == 1000) {
                Toast.info("投票成功", 1);
                let needToUpdateData = {
                    type: 'post', //路由名称
                    data: postData
                }
                localStorage.setItem("needToUpdateData", JSON.stringify(needToUpdateData)); //需要更新指定数据
                dispatch(getPostByIdAsync(postData)); //更新帖子状态

            } else {
                Toast.info(data.msg, 2);
            }
        }, () => {
            Toast.hide(); //隐藏Toast
            Toast.info("系统繁忙，请稍后再试");
        });
    }
}


/**
 * 本地删除指定社区的帖子列表
 */
export const removePostsByGroupId = (groupId) => {
    return {
        type: REMOVE_POSTS_BY_GROUPID,
        groupId: groupId
    }
};
