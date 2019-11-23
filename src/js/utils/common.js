import jsApi from './cx580.jsApi';
class Common {
    /**
     * 获取网址
     */
    getUrl() {
        let this_url = window.location.href; //当前网址
        let substrNum = this_url.indexOf('#') + 1; //获取到哈希路由当前的位置 + 1
        let url = this_url.substr(0, substrNum);
        return url;
    }

    /**
     * 将键值对转为URL参数
     */
    _toQueryPair(key, value) {
        ///<summary>将键值对转为URL参数</summary>
        if (typeof value == 'undefined') {
            return key;
        }
        return key + '=' + encodeURIComponent(value === null ? '' : String(value));
        //return key + '=' + (value == null ? '' : String(value));
    }

    /**
     * 将对象转为URL参数
     */
    toQueryString(obj) {
        var ret = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                key = encodeURIComponent(key);
                var values = obj[key];
                if (values && values.constructor === Array) { //数组 
                    var queryValues = [];
                    for (var i = 0, len = values.length, value; i < len; i++) {
                        value = values[i];
                        queryValues.push(this._toQueryPair(key + '[]', value));
                    }
                    ret = ret.concat(queryValues);
                } else { //字符串 
                    ret.push(this._toQueryPair(key, values));
                }
            }
        }
        return ret.join('&');
    }

    /**
     * 检测是否为车行易app
     */
    isCXYApp() {
        let isCXYApp = navigator.userAgent.indexOf('appname_cxycwz') > -1 ? true : false;
        return isCXYApp;
    }

    /**
     * 获取安卓系统的版本号 非安卓手机则返回false
     */
    getAndroidVersion() {
        let re = /Android\s([^;]+)/ig;
        let _version = re.exec(navigator.userAgent);
        if (_version) {
            _version = _version[1];
        } else {
            _version = false;
        }
        return _version;
    }

    browser = function () {
        let u = navigator.userAgent;
        //app = navigator.appVersion;
        return {
            versions: { //移动终端浏览器版本信息 
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端 
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器 
                iPad: u.indexOf('iPad') > -1, //是否iPad 
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 //android终端或uc浏览器 
            }
        }
    }

    /**
     * 获取APP的版本号
     */
    getAppVersion = function () {
        let u = navigator.userAgent;
        if (u.indexOf('appname_cxycwz/') > -1) {
            return u.substr(u.indexOf('appname_cxycwz/') + 15);
        }
        return false;
    }

    /**
     * 检测当前浏览器是否为iPhone(Safari)
     */
    isIPhone = function () {
        let browser = this.browser();
        if (browser.versions.iPhone || browser.versions.iPad || browser.versions.ios) {
            return true;
        }
        return false;
    };

    /**
     * 检测当前浏览器是否为Android(Chrome)
     */
    isAndroid = function () {
        let browser = this.browser();
        if (browser.versions.android) {
            return true;
        }
        return false;
    };

    /**
     * 判断当前系统是否需要追加20px的头部像素，用于兼容APP的头部沉浸模式
     */
    needAddAppHeaderHeight() {
        if (!this.isCXYApp()) {
            return false; //非车行易APP不用增加头部高度
        }
        let version = this.getAndroidVersion();
        if (version) {
            version = version.split(".");
            if ((version[0] * 1) < 5 && (version[1] * 1) < 4) {
                return false; //4.4以下的系统不用添加头部高度
            }
        }
        return true;
    }

    /**
     * 打开APP新视图
     * @param url 打开的URL
     * @param noNeedToUpdateData 是否不需要更新数据 默认false
     * @param showTitle 是不是显示APP的标题栏 存在时 有新使用此字段的值
     */
    openNewBrowserWithURL(url, noNeedToUpdateData = false, showTitle) {
        if (noNeedToUpdateData) {
            localStorage.setItem("noNeedToUpdateData", "1"); //不需要更新数据
        }

        let showTitleLayout = "true";
        if (url.substr(0, 4) !== 'http') {
            url = this.getUrl() + url; //如果不是外网，则自动加载网址
            showTitleLayout = "false"; //不需要显示导航条
        }

        if (showTitle) {
            showTitleLayout = showTitle; //不需要显示导航条
        }

        window["pageUrl"] = url; //保存网址

        if (!this.isCXYApp()) {
            window.location.href = url;
            return;
        }

        try {
            jsApi.call({
                "commandId": "",
                "command": "openNewBrowserWithURL",
                "data": {
                    "url": url,
                    "umengId": "cfw_youkachongzhi",
                    "showTitleLayout": showTitleLayout //是否显示到导航栏
                }
            }, function (data) {

            });
        } catch (error) {
            //执行到这里，说明不在 app 中运行
            window.location.href = url;
        }
    }
    /**
    * 打开APP新视图 : 针对 资讯列表的更多
    */
    openNewBrowserWithNewURL(tabName, tabId) {
        let showTitleLayout = "true";

        if (!this.isCXYApp()) {
            window.history.back();
            return;
        }

        try {
            jsApi.call({
                "commandId": "",
                "command": "openNewsList",
                "data": {
                    "tabName": tabName,
                    "tabId": tabId,
                    "showTitleLayout": showTitleLayout //是否显示到导航栏
                }
            }, function (data) {

            });
        } catch (error) {
            //执行到这里，说明不在 app 中运行
            window.history.back();
        }
    }

    /**
     * 关闭APP视图
     * @param noNeedToUpdateData 是否不需要更新数据 默认false
     */
    closeAppView(noNeedToUpdateData = false) {
        if (noNeedToUpdateData) {
            localStorage.setItem("noNeedToUpdateData", "1"); //不需要更新数据
        }

        if (!this.isCXYApp()) {
            window.history.back();
            return;
        }
        try {
            jsApi.call(
                {
                    "commandId": "",
                    "command": "close"
                }
            )
        } catch (error) {
            //执行到这里，说明不在 app 中运行
            window.history.back();
        }
    }

    /**
     * 拍照接口
     */
    picture(callback) {
        if (this.isCXYApp()) {
            if (!this.callbackPicture()) {
                return;
            }
            //默认
            let data = {
                "quality": 75,/*图片质量, 取值1到100*/
                "maxWidth": 768,/*图片的最大宽度. 过大将被等比缩小*/
                "maxSize": 500
            };
            let version = this.getAppVersion();

            if (version) {
                version = version.split(".");
                if ((version[0] * 1) > 6 || ((version[0] * 1) > 5 && (version[1] * 1) > 0)) {
                    //APP 6.1.0以上
                } else {
                    //APP 6.1.0以下
                    data = {
                        "quality": 75,/*图片质量, 取值1到100*/
                        "maxWidth": 512,/*图片的最大宽度. 过大将被等比缩小*/
                        "maxHeight": 512,/*图片的最大高度. 过大将被等比缩小*/
                        "maxSize": 300
                    };
                }
            }
            jsApi.call({
                "commandId": "",/*命令主键，每次调用，必须用全局唯一的字符串*/
                "command": "picture",/*执行的命令，原生APP会根据此值执行相应的逻辑*/
                "data": data
            }, function (result) {
                callback(result.data.dataBase64); //回调函数
            });
        }
    }

    /**
     * 判断是否需要调用APP的图片上传接口
     */
    callbackPicture() {
        if (this.isCXYApp()) {
            if (this.isIPhone()) {
                return true;
            } else if (this.isAndroid()) {
                let version = this.getAppVersion();
                if (version) {
                    version = version.split(".");
                    if (version.length > 2 && (version[0] * 1) > 5 && ((version[2] * 1) > 1 || (version[1] * 1) > 0)) {
                        return true; //安卓6.0.2及以上版本才调用APP图片上传接口
                    }
                }
            }
        }
        return false;
    }

    /**
     * 关闭安卓加载中
     */
    controlLoading() {
        if (this.isCXYApp()) {
            // jsApi.call({
            //     "commandId": "",/*命令主键，每次调用，必须用全局唯一的字符串*/
            //     "command": "controlLoading",/*执行的命令，原生APP会根据此值执行相应的逻辑*/
            //     "data": {
            //         "status": "close"
            //     }
            // }, function (data) { });
        }
    }

    /**
     * 分享
     */
    share(data) {
        if (!this.isCXYApp()) {
            return false;
        }
        try {
            data.title = this.delHtmlTag(data.title);
            data.content = this.delHtmlTag(data.content);

            jsApi.call(
                {
                    "commandId": "",
                    "command": "share",
                    "data": data
                }
            )
        } catch (error) {
            //执行到这里，说明不在 app 中运行
            return false;
        }
        return true
    }

    /**
     * 删除HTML的tag
     */
    delHtmlTag(str) {
        return str.replace(/<[^>]+>/g, "");//去掉所有的html标记
    }

    /**
     * 获取URL上key的值 并且保存在sessionStorage中
     */
    getKeyVaule(key) {
        if (!key) {
            return key;
        }
        var keyName = key; //保存keyName
        var search = window.location.href; //由于hash值的原因 这里不用window.location.search用window.locationhref
        key = new RegExp('[\?|&]' + key + '=([^&]+)', 'g');
        key = key.exec(search);
        key = key ? key[1] : "";
        //   sessionStorage.setItem(keyName, key); //key
        return key.split("#")[0] //避免返回的数据带有hash值
    }

    /**
     * 获取JsApi的userType
     */
    getJsApiUserType() {
        var userType = '';
        var ua = navigator.userAgent;
        if (ua.toLowerCase().match(/MicroMessenger/i) == "micromessenger") {
            userType = 'weixin';
        } else if (ua.indexOf("appname_cxycwz") !== -1) {
            userType = 'app';
        } else if (ua.indexOf("AlipayClient") !== -1) {
            userType = 'alipay';
        } else if (ua.indexOf("QQ") !== -1) {
            userType = 'qq';
        }
        return userType;
    }

    /**
     * 获取URL上的keyValue
     * @param {*string} key
     */
    getUrlKeyValue(key) {
        if (!key) {
            return key;
        }
        var keyName = key; //保存keyName
        var search = window.location.href; //由于hash值的原因 这里不用window.location.search用window.locationhref
        key = new RegExp('[\?|&]' + key + '=([^&]+)', 'g');
        key = key.exec(search);
        key = key ? key[1] : "";
        // sessionStorage.setItem(keyName, key); //key
        return key.split("#")[0] //避免返回的数据带有hash值
    }

    /**
     * 获取cookie
     * @param {*string} name 
     */
    getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }

};

// 实例化后再导出
export default new Common()