/**
 * 社区相关接口
 */

import apiHelper from './apiHelper';
import userHelper from '../utils/userHelper';

class CommunityService {

    /**
     * 获取所有社区
     * @param data Object
     *  {"userId": "13800138000"//用户id
     * ,"token": "ADJKSKJNKJASLKSKLS"//token
     * }
     */
    getGroupList(data) {
        let requestParam = {
            url: `${apiHelper.baseApiUrl}groups/get_group_list`,
            data: {
                method: 'post',
                body: data
            }
        };
        return apiHelper.fetch(requestParam);
    }


    /**
     * 获取社区首页栏目
     * @param data Object
     *  {"userId": "13800138000"//用户id
     * ,"token": "ADJKSKJNKJASLKSKLS"//token
     * }
     */
    getDefaultFollow(data) {
        let UserIdAndToken = userHelper.getUserIdAndToken();
        let requestParam = {
            url: `${apiHelper.baseApiUrl}groups/get_default_follow.html?cityName=` + UserIdAndToken.city,
            data: {
                method: 'post',
                body: data
            }
        };
        return apiHelper.fetch(requestParam);
    }


    /**
     * 获取已关注的社区
     * @param data Object
     *  {"userId": "13800138000"//用户id
     * ,"token": "ADJKSKJNKJASLKSKLS"//token
     * }
     */
    getMemberFollow(data) {
        let UserIdAndToken = userHelper.getUserIdAndToken();
        let requestParam = {
            url: `${apiHelper.baseApiUrl}groups/get_member_follow?cityName=` + UserIdAndToken.city,
            data: {
                method: 'post',
                body: data
            }
        };
        return apiHelper.fetch(requestParam);
    }


    /**
     * 更新关注
     * @param data Object
     *  {"userId": "13800138000"//用户id
     * ,"token": "ADJKSKJNKJASLKSKLS"//token
     * ,"groupIds":["1", "2"]//社区id数组
     * }
     */
    updateMemberFollow(data) {
        let requestParam = {
            url: `${apiHelper.baseApiUrl}groups/add_member_follow`,
            data: {
                method: 'post',
                body: data
            }
        };
        return apiHelper.fetch(requestParam);
    }

    /**
     * 获取社区广告图
     * @param data object
     * {
     * url:'', //图片Url
     * targetUrl:'' //跳转目标的URL
     * }
     */
    getAd(data){
        let requestParam = {
            url: `${apiHelper.baseApiUrl}slide/index`,
            data: {
                method: 'post',
                body: data
            }
        };
        return apiHelper.fetch(requestParam);
    }

}
// 实例化后再导出
export default new CommunityService()