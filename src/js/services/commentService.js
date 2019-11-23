/**
 * 评论相关接口
 */

import apiHelper from './apiHelper';
import userHelper from '../utils/userHelper';

class CommentService {

    /**
     * 获取所有评论
     * @param data Object
     *  {"userId": "13800138000"//用户id
     * ,"token": "ADJKSKJNKJASLKSKLS"//token
     * ,"groupId":""//社区ID
     * ,"postsId":""//帖子ID
     * ,"pageNo":""//第一页，默认1
     * ,"pagesize":""//分页数量，默认10
     * }
     */
    getComments(data) {
        let requestParam = {
            url: `${apiHelper.baseApiUrl}comments/index/`,
            data: {
                method: 'post',
                body: data
            }
        };
        return apiHelper.fetch(requestParam);
    }


    /**
     * 删除评论
     * @param data Object
     *  {"userId": "13800138000"//用户id
     * ,"token": "ADJKSKJNKJASLKSKLS"//token
     * ,"groupId":""//社区ID
     * ,"postsId":""//帖子ID
     * ,"com_id":""//评论ID
     * }
     */
    deleteComment(data) {
        let requestParam = {
            url: `${apiHelper.baseApiUrl}comments/del`,
            data: {
                method: 'post',
                body: data
            }
        };
        return apiHelper.fetch(requestParam);
    }


    /**
    * 评论
    * @param data Object
    *  {"userId": "13800138000"//用户id
    * ,"token": "ADJKSKJNKJASLKSKLS"//token
    * ,"groupId":""//社区ID
    * ,"postsId":""//帖子ID
    * ,"content":""//评论内容
    * }
    */
    createComment(data) {
        let requestParam = {
            url: `${apiHelper.baseApiUrl}comments/add`,
            data: {
                method: 'post',
                body: data
            }
        };
        return apiHelper.fetch(requestParam);
    }


    /**
    * 获取评论的回复
    * @param data Object
    *  {"userId": "13800138000"//用户id
    * ,"token": "ADJKSKJNKJASLKSKLS"//token
    * ,"groupId":""//社区ID
    * ,"postsId":""//帖子ID
    * ,"comId":""//评论ID
    * }
    */
    getReply(data) {
        let requestParam = {
            url: `${apiHelper.baseApiUrl}reply/index/`,
            data: {
                method: 'post',
                body: data
            }
        };
        return apiHelper.fetch(requestParam);
    }


    /**
    * 删除评论的回复
    * @param data Object
    *  {"userId": "13800138000"//用户id
    * ,"token": "ADJKSKJNKJASLKSKLS"//token
    * ,"groupId":""//社区ID
    * ,"postsId":""//帖子ID
    * ,"com_id":""//评论ID
    * ,"reply_id":""//回复ID
    * }
    */
    deleteReply(data) {
        let requestParam = {
            url: `${apiHelper.baseApiUrl}reply/del`,
            data: {
                method: 'post',
                body: data
            }
        };
        return apiHelper.fetch(requestParam);
    }


    /**
    * 添加评论的回复
    * @param data Object
    *  {"userId": "13800138000"//用户id
    * ,"token": "ADJKSKJNKJASLKSKLS"//token
    * ,"groupId":""//社区ID
    * ,"postsId":""//帖子ID
    * ,"com_id":""//评论ID
    * ,"content":""//评论内容
    * ,"pid":"0"	//上一级回应ID
    * }
    */
    createReply(data) {
        let requestParam = {
            url: `${apiHelper.baseApiUrl}reply/add`,
            data: {
                method: 'post',
                body: data,
            }
        };
        return apiHelper.fetch(requestParam);
    }

    /**
    * 帖子问答设置最佳答案接口
    * @param data Object
    *  {"userId": "13800138000"//用户id
    * ,"token": "ADJKSKJNKJASLKSKLS"//token
    * ,"groupId":""//社区ID
    * ,"postsId":""//帖子ID
    * ,"com_id":""//评论ID
    * }
    */
    setSolution(data) {
        let requestParam = {
            url: `${apiHelper.baseApiUrl}posts/set_solution`,
            data: {
                method: 'post',
                body: data
            }
        };
        return apiHelper.fetch(requestParam);
    }

}
// 实例化后再导出
export default new CommentService()