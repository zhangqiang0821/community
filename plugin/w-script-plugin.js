const webConfig = require('../webs-config'); //项目配置

function ScriptPlugin(options) {
    // Configure your plugin with options...
}
ScriptPlugin.prototype.apply = function (compiler) {
    //添加JS的属性
    var name = this.name1;
    compiler.plugin('compilation', function (compilation) {
        compilation.plugin('html-webpack-plugin-alter-asset-tags', function (htmlPluginData, callback) {
            console.log("------ScriptPlugin------",htmlPluginData)
            htmlPluginData.head.map((item, i) => {
                if(htmlPluginData.body[i].tagName == 'script' && webConfig.script){
                    for(let attr in webConfig.script){
                        htmlPluginData.body[i].attributes[attr] = webConfig.script[attr];
                    }
                }
            })
            htmlPluginData.body.map((item, i) => {
                if(htmlPluginData.body[i].tagName == 'script' && webConfig.script){
                    for(let attr in webConfig.script){
                        htmlPluginData.body[i].attributes[attr] = webConfig.script[attr];
                    }
                }
            })
            callback(null, htmlPluginData);
        });
    });

};

module.exports = ScriptPlugin;