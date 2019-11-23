import jsApi from './cx580.jsApi';
import common from './common';
import config from '../config'
import { Modal, Toast } from 'antd-mobile'

let g_userType = undefined;

let g_userId = 'CXY_51374EB0DCDE4373BE4FA95C226B4116'; //CXY_3FBA032214714C19BA4CCA267F86C550
let g_userToken = ''; //60EB65A06DD3471C7B769091A9F70CBE

let g_city = "";

/**
 * 用户帮助类
 */
class UserHelper {
    //userContainer = "";
    // userId = "";
    // userToken = "";
    //city = "";


    constructor() {
        this._initialize();
    }

    _initialize() {
        // setTimeout(() => {
        //     this._getContainer();
        // }, 500);
        if (common.isCXYApp()) {
            //执行到这里，说明是在 app 中运行
            g_userType = "App";
            this._getUserInfoFromApp();
            // setTimeout(() => {
            //     this._getUserInfoFromApp();
            // }, 150);
        } else {
            //执行到这里，说明不在 app 中运行
            g_userType = "";
            // alert("请使用车行易APP访问！");
        }
    }

    _getContainer() {
        try {
            jsApi.call({
                "commandId": "",
                "command": "netstat"
            }, (data) => {
                //执行到这里，说明是在 app 中运行
                g_userType = "App";
                this._getUserInfoFromApp();
            });
        } catch (error) {
            //执行到这里，说明不在 app 中运行
            g_userType = "";
        }
    }


    /**
     * 从 app 中获取用户 token
     */
    _getUserInfoFromApp() {
        try {
            jsApi.call({
                "commandId": "",
                "command": "getSymbol",
                "data": {
                    "accountId": "",
                    "token": "",
                    "city": ""
                }
            }, (data) => {
                g_userId = data.data.accountId;
                g_userToken = data.data.token;
                g_city = data.data.city;
            });
        } catch (error) {
            //执行到这里，说明不在 app 中运行
            // alert("调试信息：调用APP JS SDK出错了 获取APP信息出错了");
        }
    }

    /**
     * 获取getSymbol的值
     * @param callback 回调函数
     */
    getSymbol(callback) {
        try {
            jsApi.call({
                "commandId": "",
                "command": "getSymbol",
                "data": {
                    "accountId": "",
                    "token": "",
                    "city": ""
                }
            }, (data) => {
                g_userId = data.data.accountId;
                g_userToken = data.data.token;
                g_city = data.data.city;
                callback(data.data)
            });
        } catch (error) {
            let data = {
                "userid": "",
                "lng": "",
                "lat": "",
                "version": "",
                "channel": "",
                "cars": "",
                "phone": "",
                "name": "",
                "type|orderNum": "",
                "city": "",
                "accountId": "",
                "token": "",
                "carId": "",
                "carNumber": "",
                "headImage": "",
                "nickName": ""
            }
            callback(data)
        }
    }

    /**
     * app 登陆
     */
    _appLogin(callback) {
        jsApi.call({
            "commandId": "",
            "command": "login"
        }, (data) => {
            localStorage.setItem("upLoginState", "1"); //用户登录状态发生变化
            if (data.data.accountId) {
                g_userId = data.data.accountId;
                this._getUserInfoFromApp();
                if (callback) {
                    callback();
                }
            }
        });
    }

    /**
     * 获取 userId 和 token
     */
    getUserIdAndToken() {
        if (!common.isCXYApp()) {
            //非APP
            return {
                userId: sessionStorage.getItem('userId'),
                token: sessionStorage.getItem('token'),
                userType: sessionStorage.getItem('userType'),
                authType: sessionStorage.getItem('authType'),
                city: sessionStorage.getItem('city')
            }
        }
        this._getUserInfoFromApp();
        return {
            userId: g_userId,
            token: g_userToken,
            userType: 'APP',
            authType: 'APP',
            city: g_city
        }
    }

    /**
     * 登陆
     * @param callback function 登陆成功之后的回调
     */
    Login(callback) {
        //避免弹出多个提示框，这里先清除上一个提示框
        let div = document.querySelector(".am-modal-wrap");
        if (div) {
            div = div.parentNode;
            if (div) {
                div.parentNode.removeChild(div);
            }
        }

        if (common.isCXYApp()) {
            Modal.alert('', <span style={{ fontSize: '16px', padding: '15px 0', color: '#1a1a1a', display: 'block' }}>此操作需要登录才能完成</span>, [
                { text: '取消', onPress: () => false, style: { color: '#108ee9' } },
                {
                    text: '登录', onPress: () => {
                        if (g_userType == "App") {
                            this._appLogin(callback)
                        } else {
                            alert("Login no app")
                        }
                    }, style: { color: '#108ee9' }
                }
            ])
        } else {
            Modal.alert('', <span style={{ fontSize: '16px', padding: '15px 0', color: '#1a1a1a', display: 'block' }}>此操作需要登录才能完成</span>, [
                { text: '取消', onPress: () => false, style: { color: '#108ee9' } },
                {
                    text: '登录', onPress: () => {
                        this.toAuthUrl(); //跳转到单点登录
                    }, style: { color: '#108ee9' }
                }
            ])
            // Modal.alert('', <span style={{ fontSize: '16px', padding: '15px 0', color: '#1a1a1a', display: 'block' }}>下载车行易APP参与发帖/评论</span>, [
            //     { text: '取消', onPress: () => false, style: { color: '#108ee9' } },
            //     {
            //         text: '下载', onPress: () => {
            //             window.location.href = '//a.app.qq.com/o/simple.jsp?pkgname=com.violationquery&ckey=CK1336413494933' //跳转到APP下载页面
            //         }, style: { color: '#108ee9' }
            //     }
            // ])
        }
    }

    /**
     * 跳转到单点登录
     */
    toAuthUrl() {
        Toast.loading('',0);
        sessionStorage.clear(); //清空sessionStorage缓存
        let url = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.hash; //好像不用编码 编码反而出错？
        url = url.replace('#', '%23'); //替换#号
        url = url.split('?')[0]; //过滤？号     
        window.location.replace(config.authUrl + url); //跳转到单点登录
    }
};

// 实例化后再导出
export default new UserHelper()