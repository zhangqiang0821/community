/**
 * 帖子相关接口
 */

import apiHelper from './apiHelper';
import userHelper from '../utils/userHelper';

class PostService {


    /**
     * 根据社区获取帖子列表
     * @param data Object
     *  {"userId": "13800138000"//用户id
     * ,"token": "ADJKSKJNKJASLKSKLS"//token
     * ,"groupId":"问答Id"//社区id
     * ,"extends":[10,11]//1、默认是0   2、groupId = 问答Id, 跟我相关："10";未解决:"11";已解决:"12"   3、groupId = 吐槽Id,我的吐槽："20"; 易友吐槽: "21"
     * ,"pageNo":1//第一页  默认是1
     * ,"pageSize":10//分页数量 默认是10
     * ,"cityName":""//城市名称，易友吐槽的时候需要
     * ,direction:''//up 上划 down下拉。
     * ,postsId:''//根据最后一个帖子的ID来拉取数据
     * }
     */
    getPostsByGroupId(data) {
        data.cityName = userHelper.getUserIdAndToken().city; //城市
        let requestParam = {
            url: `${apiHelper.baseApiUrl}posts/index`,
            data: {
                method: 'post',
                body: data
            }
        };
        return apiHelper.fetch(requestParam);
    }


    /**
     * 获取帖子详情
     * @param data Object
     *  {"userId": "13800138000"//用户id
     * ,"token": "ADJKSKJNKJASLKSKLS"//token
     * ,"groupId":"82345678"//社区id
     * ,"postsId":1//帖子ID
     * ,"Step":1//默认是1，可不传当是查看投票结果的时候，传2
     * }
     */
    getPostById(data) {
        let requestParam = {
            url: `${apiHelper.baseApiUrl}posts/show`,
            data: {
                method: 'post',
                body: data
            }
        };
        return apiHelper.fetch(requestParam);
    }

    /**
     * 获取帖子的信息（点赞、评论数、投票数、是否已点赞等）
     * @param data Object
     *  {"userId": "13800138000"//用户id
     * ,"token": "ADJKSKJNKJASLKSKLS"//token
     * ,"groupId":"82345678"//社区id
     * ,"postsId":1//帖子ID
     * }
     */
    getPostsInfo(data) {
        let requestParam = {
            url: `${apiHelper.baseApiUrl}posts/get_posts_info`,
            data: {
                method: 'post',
                body: data
            }
        };
        return apiHelper.fetch(requestParam);
    }

    /**
    * 帖子点赞
    * @param data Object
    *  {"userId": "13800138000"//用户id
    * ,"token": "ADJKSKJNKJASLKSKLS"//token
    * ,"groupId":"82345678"//社区id
    * ,"postsId":1//帖子ID
    * ,"ac_type":1//默认为空 4：帖子点赞 5：帖子取消点赞
    * }
    */
    praise(data) {
        let requestParam = {
            url: `${apiHelper.baseApiUrl}posts/praise`,
            data: {
                method: 'post',
                body: data
            }
        };
        return apiHelper.fetch(requestParam);
    }


    /**
    * 删除帖子
    * @param data Object
    *  {"userId": "13800138000"//用户id
    * ,"token": "ADJKSKJNKJASLKSKLS"//token
    * ,"groupId":"82345678"//社区id
    * ,"postsId":1//帖子ID
    * }
    */
    deletePostById(data) {
        let requestParam = {
            url: `${apiHelper.baseApiUrl}posts/del`,
            data: {
                method: 'post',
                body: data
            }
        };
        return apiHelper.fetch(requestParam);
    }


    /**
    * 发帖（话题，问答，投票）
    * @param data Object
    *  {"userId": "13800138000"//用户id
    * ,"token": "ADJKSKJNKJASLKSKLS"//token
    * ,"groupId":"82345678"//社区id
    * ,"catid":""//分类ID
    * ,"content":""//内容
    * ,"imgList":["1.jpg", "2.jpg""]//图片
    * ,"vote_options":[]//投票选项
    * ,"points":0 //0：积分未增加或增加失败，> 0 是增加的积分值
    * }
    */
    createPost(data) {
        let requestParam = {
            url: `${apiHelper.baseApiUrl}posts/add`,
            data: {
                method: 'post',
                body: data
            }
        };
        return apiHelper.fetch(requestParam);
    }


    /**
    * 投票
    * @param data Object
    *  {"userId": "13800138000"//用户id
    * ,"token": "ADJKSKJNKJASLKSKLS"//token
    * ,"groupId":"82345678"//社区id
    * ,"postsId":""//帖子ID
    * ,"voteId":"",//选项ID
    * }
    */
    vote(data) {
        let requestParam = {
            url: `${apiHelper.baseApiUrl}posts/add_vote`,
            data: {
                method: 'post',
                body: data
            }
        };
        return apiHelper.fetch(requestParam);
    }


    /**
    * 图片上传(暂不可用)
    * @param data Object
    *  {"userId": "13800138000"//用户id
    * ,"token": "ADJKSKJNKJASLKSKLS"//token
    * ,"image":""//图片文件
    * }
    */
    upload(data) {
        let requestParam = {
            url: `${apiHelper.baseApiUrl}index/upload`,
            data: {
                method: 'post',
                body: data
            }
        };
        return apiHelper.fetch(requestParam);
    }

    /**
     * 我的帖子
     * @param data Object
     * {
     *  "userId": "", //用户id
     *  "pageNo": "1", //第一页  默认是1
     *  "pageSize": "10", //分页数量 默认是10
     *  "token": "" //token
     * }
     */
    myPost(data){
        let requestParam = {
            url: `${apiHelper.baseApiUrl}posts/mypost`,
            data: {
                method: 'post',
                body: data
            }
        };
        return apiHelper.fetch(requestParam);
    }

}
// 实例化后再导出
export default new PostService()