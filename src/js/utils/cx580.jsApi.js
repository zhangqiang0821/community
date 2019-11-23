/**
 * App JS SDK
 */

let jsApi = {};
try {
    window.cx580.jsApi.config({
        version: window.location.href.indexOf('api_version=3') > -1 ? '3.0' : '2.0', //jsApi版本
        jsApiList: [] //注册需要APP监听的jsApi列表
    }, function (data) {
        // alert(JSON.stringify(data));
    })
    jsApi = window.cx580.jsApi;
} catch (error) {
    //非APP环境
}

export default jsApi;