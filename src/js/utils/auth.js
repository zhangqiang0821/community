import common from './common'
import config from '../config'

//组件
import { Modal } from 'antd-mobile';

/**
 * 登录授权
 */
class Auth {

    constructor() {
        this.debug = !config.production
        this.debug = false
        this.init()
    }

    init() {
        let userType = common.getJsApiUserType()
        if (userType != 'app') {

            let userInfo = this.getUserInfo();
            if (!userInfo.userId || !userInfo.token) {
                //userId或token不存在 则去单点登录
                Modal.alert('', <span style={{ fontSize: '16px', padding: '15px 0', color: '#1a1a1a', display: 'block' }}>登陆账号即可获得更多权限</span>, [
                    { text: '取消', onPress: () => false, style: { color: '#108ee9' } },
                    {
                        text: '登录', onPress: () => {
                            this.toAuthUrl(); //跳转到单点登录
                        }, style: { color: '#108ee9' }
                    }
                ])
            } else {
                //保存用户信息
                this.setUserInfo(userInfo);
            }
        }
    }

    /**
     * 获取用户信息（userId、token、userType、authType）
     * 先从cookie中获取，如果cookie中没有则从url上获取
     */
    getUserInfo() {
        let keyPre = ''; //cookie key值的前缀
        if (!config.production) {
            //测试环境
            keyPre = 'test_';
        }

        return {
            userId: common.getCookie(keyPre + 'userId') || common.getUrlKeyValue('userId') || '',
            token: common.getCookie(keyPre + 'userToken') || common.getUrlKeyValue('token') || '',
            userType: common.getUrlKeyValue('userType') || common.getJsApiUserType() || 'alipay',
            authType: common.getUrlKeyValue('authType') || common.getJsApiUserType() || 'alipay'
        }
    }

    /**
     * 单点登录
     */
    toAuthUrl() {
        //走单点登录，获取用户信息
        if (!common.getUrlKeyValue('userId') || !common.getUrlKeyValue('token')) {
            //没有用户信息时跳转到单点登录
            sessionStorage.clear(); //清空sessionStorage缓存
            localStorage.clear();

            let url = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.hash; //好像不用编码 编码反而出错？
            url = url.replace('#', '%23'); //替换#号
            url = url.split('?')[0]; //过滤？号
            url += '?t=' + new Date().getTime(); //加一个时间戳，避免服务器挂后，一直读取缓存的数据
            window.location.replace(config.authUrl + url); //跳转到单点登录
        } else {
            //保存用户信息
            this.setUserInfo({
                userId: common.getUrlKeyValue('userId'),
                token: common.getUrlKeyValue('token'),
                userType: common.getUrlKeyValue('userType'),
                authType: common.getUrlKeyValue('authType')
            })
        }
    }

    /**
     * 保存用户信息
     * @param {*object} user 
     * {
     * userId:'',
     * token:'',
     * userType:'',
     * authType:''
     * }
     */
    setUserInfo(user) {
        sessionStorage.setItem('userId', user.userId);
        sessionStorage.setItem('token', user.token);
        sessionStorage.setItem('userType', user.userType);
        sessionStorage.setItem('authType', user.authType);
    }

};

// 实例化后再导出
export default new Auth();