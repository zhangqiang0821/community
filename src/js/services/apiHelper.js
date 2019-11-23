import config from '../config'
import common from '../utils/common';
import userHelper from '../utils/userHelper';
import { Toast } from 'antd-mobile'
import * as fetchStatusActions from '../actions/fetchStatusActions'

require('isomorphic-fetch');

class ApiHelper {

    production = window.location.href.indexOf('://comments.cx580.com') > -1 ? true : false; //是否为生产环境

    /**
     * 切换生产或测试环境 (桥桥的图片上传接口 测试环境目前不支持https)
     * "http://192.168.1.235:18066/"; //测试
     * "https://192.168.1.235:18067/"; //测试 https
     * "http://comments.cx580.com:6050/";//生产
     * "https://comments.cx580.com/";//生产 https
     */
    baseApiUrl = config.baseApiUrl;

    /**
     * 获取 HTTP 头
     */
    _getHeaders() {
        return {
            "Accept": "*/*"
        }
    }

    /**
     * 封装fetch
     */
    fetch(requestParam) {
        let UserIdAndToken = userHelper.getUserIdAndToken(); //先去获取用户数据，避免数据没有实时返回

        let timeoutId = -1; //超时句柄ID
        let fetchTimeid = -1; //fetch请求句柄ID

        let promise = new Promise((resolve, reject) => {
            fetchTimeid = setTimeout(() => {
                window.fetchTimeoutNumber = 0; //只延迟首次，后续的数据请求不再延迟

                // console.log("requestParam", requestParam);
                requestParam.data.method = requestParam.data.method || "get";
                requestParam.data.headers = requestParam.data.headers || {};
                Object.assign(requestParam.data.headers, this._getHeaders());
                if (requestParam.data.method.trim() == "post") {
                    requestParam.data.headers["Content-Type"] = "application/x-www-form-urlencoded";
                }

                requestParam.data.body = requestParam.data.body || {};
                //设置用户
                UserIdAndToken = userHelper.getUserIdAndToken();
                if (!requestParam.data.body.userId) {
                    requestParam.data.body["userId"] = UserIdAndToken.userId;
                }
                if (!requestParam.data.body.token) {
                    requestParam.data.body["token"] = UserIdAndToken.token;
                }
                if (!requestParam.data.body.userType) {
                    requestParam.data.body["userType"] = UserIdAndToken.userType;
                }
                if (!requestParam.data.body.authType) {
                    requestParam.data.body["authType"] = UserIdAndToken.authType;
                }
                //保存用户信息及城市信息(用于判断是否需要刷新页面重新获取信息)
                localStorage.setItem("g_userId", UserIdAndToken.userId);
                localStorage.setItem("g_userToken", UserIdAndToken.token);
                localStorage.setItem("g_city", UserIdAndToken.city);

                requestParam.data.body = common.toQueryString(requestParam.data.body);


                requestParam.data.mode = "cors";
                var request = new Request(requestParam.url, requestParam.data);
                //console.debug("request", request);
                let result = window.fetch(request)
                    .then(function (response) {
                        let resp = response.json();
                        resp.then(function (data) {
                            if (data.code == "90015") {
                                userHelper.Login();
                            }
                        });
                        clearTimeout(timeoutId) //数据正常返回后不再显示网络超时
                        return resp;
                    })
                    .catch(function (e) {
                        clearTimeout(timeoutId) //数据正常返回后不再显示网络超时
                        console.error("fetch 请求出错了");
                        console.dir(e);
                        if (e.message == 'Failed to fetch' || e.message == 'Network request failed') {
                            console.log("网络错误：", requestParam.url)
                            // window.dispatch(fetchStatusActions.networkError(true)) //网络错误 刷新后 ios会出现双标题 所以这里不做处理
                        }
                        throw e;
                    });
                console.log("result", result);
                
                resolve(result)
            }, window.fetchTimeoutNumber || 250);

            // 网络超时
            timeoutId = setTimeout(() => {
                console.log("网络错误：", requestParam.url)
                // window.dispatch(fetchStatusActions.networkError(true)) //网络错误 刷新后 ios会出现双标题 所以这里不做处理
                clearTimeout(fetchTimeid) //网络超时后不再请求数据
                reject('网络错误')
            }, 25000); //超时时间设为25秒，避免原来30秒的超时弹窗出现
        });

        return promise;
    }
}

// 实例化后再导出
export default new ApiHelper()