/**
 * 配置
 */
import common from './utils/common'

const userType = sessionStorage.getItem('userType') || common.getUrlKeyValue('userType') || common.getJsApiUserType() || 'alipay'
const authType = sessionStorage.getItem('authType') || common.getUrlKeyValue('authType') || common.getJsApiUserType() || 'alipay'
const production = window.location.host.indexOf('comments.cx580.com') > -1; //是否为生产环境
const authUrl = (production ? 'https://auth.cx580.com/Auth.aspx' : 'http://testauth.cx580.com/Auth.aspx') + `?userType=${userType}&authType=${authType}&clientId=CheWu&redirect_uri=`;

export default {
    //是否为生产环境
    production: production,

    //接口地址
    baseApiUrl: production ? window.location.protocol + "//" + window.location.host + "/" : "http://192.168.1.235:18066/",
    
    //单点登录地址 回调地址需自行补全
    authUrl: authUrl,

    //直播URL
    zhiboUrl: window.location.protocol + "//" + window.location.host + "/H5/CheZhanZhiBo/index.html?api_version=3#/zhibo",

    //调试的userId
    debugUsers: ['B406E4D73A704585AB64B35E2A7896BA', 'B4C02D709C9E41AAB3F7B40BD073B4B5'], //debug的userId账号
}