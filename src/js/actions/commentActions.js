/**
 * 评论
 */
import {
    GET_COMMENTS, //获取评论列表
    GET_REPLY, //评论的评论
    CREATE_COMMENT, //增加新评论
    GET_COMMENTS_TOTAL,
    CREATE_REPLY, //添加评论的回复
    DELETE_POST, //删除帖子
    DELETE_REPLY, // 删除回复
} from './actionsTypes'
import { Toast } from 'antd-mobile'

import commentService from "../services/commentService";

export const createComment = data => ({ type: CREATE_COMMENT, data: data }); //发表评论
export const createReply = data => ({ type: CREATE_REPLY, data: data }); //添加评论的回复
export const deletePost = () => ({ type: DELETE_POST }); //删除
export const deleteReply = data => ({ type: DELETE_REPLY, data: data }); //删除
/**
 * 异步获取评论列表
 */
export const getCommentsAsync = function (data) {
    return function (dispatch) {
        let groupId = data.groupId;
        let postsId = data.postsId;
        commentService.getComments(data)
            .then(function (data) {
                if (data.data) {
                    dispatch({
                        type: GET_COMMENTS,
                        data: data.data.list,
                    });
                    dispatch({
                        type: GET_COMMENTS_TOTAL,
                        data: data.data.count,
                    });
                    //获取评论的评论
                    data.data.list.map(item => {
                        commentService.getReply({
                            groupId: groupId,
                            postsId: postsId,
                            com_id: item.id
                        })
                            .then(function (data) {
                                if (data.data) {
                                    dispatch({
                                        type: GET_REPLY,
                                        data: data.data.list,
                                        commentId: item.id
                                    });
                                } else {
                                    console.log(data);
                                }
                            });
                    });
                } else {
                    console.log(data);
                }
            });
    }
}

/**
 * 发表评论 异步
 * @param data Object
 *  {"userId": "13800138000"//用户id
 * ,"token": "ADJKSKJNKJASLKSKLS"//token
 * ,"groupId":""//社区ID
 * ,"postsId":""//帖子ID
 * ,"content":""//评论内容
 * }
 */
export const createCommentAsync = data => {
    return dispatch => {
        Toast.loading("发表中...", 30, () => Toast.info("网络错误", 2));
        let postData = {
            groupId: data.groupId,
            postsId: data.postsId,
        }
        commentService.createComment(data).then(data => {
            Toast.hide(); //隐藏Toast
            if (data.code == 1000) {
                data = data.data;
                if (data.points && data.points > 0) {
                    Toast.info(`发表成功 +${data.points}分`, 1);
                } else {
                    Toast.info('发表成功', 1);
                }
                dispatch(getCommentsAsync(postData));
            } else {
                if (data.code != "90015") {
                    Toast.info(data.msg, 2);
                }
            }
        }, () => {
            Toast.hide(); //隐藏Toast
            Toast.info("系统繁忙，请稍后再试");
        })
    }
}

/**
 * 添加评论的回复 异步
 * @param data Object
 *  {"userId": "13800138000"//用户id
 * ,"token": "ADJKSKJNKJASLKSKLS"//token
 * ,"groupId":""//社区ID
 * ,"postsId":""//帖子ID
 * ,"com_id":""//评论ID
 * ,"content":""//评论内容
 * }
 */
export const createReplyAsync = data => {
    return dispatch => {
        let postData = {
            groupId: data.groupId,
            postsId: data.postsId,
            com_id: data.com_id,
            pid: data.pid,
        }
        Toast.loading("回复中...", 30, () => Toast.info("网络错误", 2));
        commentService.createReply(data).then(data => {
            console.log("回复评论：", data);
            Toast.hide(); //隐藏Toast
            if (data.code == 1000) {
                data = data.data;
                if (data.points && data.points > 0) {
                    Toast.info(`回复成功 +${data.points}分`, 1);
                } else {
                    Toast.info('回复成功', 1);
                }
                dispatch(getCommentsAsync(postData));
            } else {
                Toast.info(data.msg, 2);
            }
        }, () => {
            Toast.hide(); //隐藏Toast
            Toast.info("系统繁忙，请稍后再试");
        })
    }
}


/**
 * 删除评论
 * {"userId": "13800138000"//用户id
 * ,"token": "ADJKSKJNKJASLKSKLS"//token
 * ,"groupId":"82345678"//社区id
 * ,"postsId":1//帖子ID
 * ,"comm_id":评论ID
 * }
 */
export const deleteCommentAsync = function (data) {
    return function (dispatch) {
        Toast.loading("", 30, () => Toast.info("网络错误", 2));
        let postData = {
            groupId: data.groupId,
            postsId: data.postsId,
        }
        commentService.deleteComment(data).then(data => {
            Toast.hide();
            if (data.code == 1000) {
                dispatch(getCommentsAsync(postData));
                Toast.info("删除成功", 1);
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
 * 删除评论的回复
 * {"userId": "13800138000"//用户id
 * ,"token": "ADJKSKJNKJASLKSKLS"//token
 * ,"groupId":"82345678"//社区id
 * ,"postsId":1//帖子ID
 * ,"com_id":评论ID
 * ,"reply_id":回复ID
 * }
 */
export const deleteReplyAsync = function (data) {
    return function (dispatch) {
        Toast.loading("", 30, () => Toast.info("网络错误", 2));
        let postData = {
            groupId: data.groupId,
            postsId: data.postsId,
            com_id: data.com_id,
            reply_id: data.reply_id,
        }
        commentService.deleteReply(data).then(data => {
            Toast.hide();
            if (data.code == 1000) {
                dispatch(deleteReply(postData));
                Toast.info("删除成功", 1);
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
 * 帖子问答设置最佳答案接口
 * {"userId": "13800138000"//用户id
 * ,"token": "ADJKSKJNKJASLKSKLS"//token
 * ,"groupId":"82345678"//社区id
 * ,"postsId":1//帖子ID
 * ,"comm_id":评论ID
 * }
 */
export const setSolutionAsync = function (data) {
    return function (dispatch) {
        Toast.loading("", 30, () => Toast.info("网络错误", 2));
        let postData = {
            groupId: data.groupId,
            postsId: data.postsId,
        }
        commentService.setSolution(data).then(data => {
            console.log("帖子问答设置最佳答案接口：", data)
            Toast.hide();
            if (data.code == 1000) {
                dispatch(getCommentsAsync(postData));
                Toast.info("设置成功", 1);
            } else {
                Toast.info(data.msg, 2);
            }
        }, () => {
            Toast.hide(); //隐藏Toast
            Toast.info("系统繁忙，请稍后再试");
        });
    }
}