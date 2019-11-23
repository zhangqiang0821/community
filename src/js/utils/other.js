/**
 * 其他JS
 */
import config from '../config'

class Other {
    constructor() {

    }
}

// 实例化后再导出
export default new Other()


window.onerror = function (msg, url, l) {
    var txt = '';
    txt = "There was an error on this page.\n\n";
    txt += "Error: " + msg + "\n";
    txt += "URL: " + url + "\n";
    txt += "Line: " + l + "\n\n";
    txt += "Click OK to continue.\n\n";
    if (config.debugUsers.indexOf(sessionStorage.getItem('userId')) > -1) {
        alert(txt);//测试环境
    } else {
        return true; //正式环境屏蔽错误
    }
}