/**
 * App JS SDK
 */
class Cx580Api {
    constructor() {
        window.cx580 = {}
        this.init();
    }

    init() {
        window.cx580.jsApi = this;
    }

    debug = false;

    browser = {
        versions: function () {
            var u = navigator.userAgent;
            //app = navigator.appVersion;
            return { //移动终端浏览器版本信息 
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端 
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器 
                iPad: u.indexOf('iPad') > -1, //是否iPad 
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 //android终端或uc浏览器 
            };
        } ()
    }

    /**
     * 检测当前浏览器是否为iPhone(Safari)
     */
    isIPhone = function () {
        if (this.browser.versions.iPhone || this.browser.versions.iPad || this.browser.versions.ios) {
            return true;
        }
        return false;
    };

    /**
     * 检测当前浏览器是否为Android(Chrome)
     */
    isAndroid = function () {
        if (this.browser.versions.android) {
            return true;
        }
        return false;
    };


    /**
     * 回调之前先处理一下下
     */
    // callbackContainer = {
    //     realCallback: undefined,
    //     shadowCallback: function (data) {
    //         if (data) {
    //             data = JSON.parse(data);
    //         } else {
    //             data = { status: 0 };
    //         }

    //         if (this.realCallback) {
    //             this.realCallback(data);
    //         }
    //         //alert("这里应该要释放资源");
    //         //还没找到解决方案
    //         delete this;
    //     }
    // }
    callbackContainer = function () {
        return {
            realCallback: undefined,
            shadowCallback: function (data) {
                if (data) {
                    data = JSON.parse(data);
                } else {
                    data = { status: 0 };
                }

                if (this.realCallback) {
                    this.realCallback(data);
                }
                //alert("这里应该要释放资源");
                //还没找到解决方案
                delete this;
            }
        }
    }


    /**
     * JavaScript调用原生APP函数
     */
    call = function (data, callback) {
        var callbackContainer = new this.callbackContainer();
        callbackContainer.realCallback = callback;
        var callbackFunctionPrefix = "window.cx580.jsApi.";
        var callbackFunctionName = "callback" + Math.floor(Math.random() * 10000000);
        window.cx580.jsApi[callbackFunctionName] = callbackContainer;
        var callbackFullName = callbackFunctionPrefix + callbackFunctionName + ".shadowCallback";

        if (this.isAndroid()) {
            try {
                javascript: window.myjavascript.sendEventFromHTML(JSON.stringify(data), callbackFullName);
            } catch (e) {
                if (this.debug) {
                    alert("js 调用 Android 出现错误：\r\n" + e.stack);
                } else {
                    throw e;
                }
            }
        } else if (this.isIPhone()) {
            try {
                window.sendEventFromHTML(JSON.stringify(data), callbackFullName);
            } catch (e2) {
                if (this.debug) {
                    alert("js 调用 IOS 出现错误：\r\n" + e2.stack);
                } else {
                    throw e2;
                }

            }
        } else {
            if (this.debug) {
                alert("不支持的手机类型");
            } else {
                throw new Error("now arguments");
            }

        }
    }
};

// 实例化后再导出
export default new Cx580Api()