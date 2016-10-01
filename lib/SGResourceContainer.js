/// <reference path="../Scripts/typings/createjs/easeljs/easeljs.d.ts"/>
/// <reference path="../Scripts/typings/createjs/preloadjs/preloadjs.d.ts"/>
/// <reference path="./SGGlobal.ts"/>
/**
 * 资源容器类
 */
var SGResourceContainer = (function () {
    function SGResourceContainer() {
    }
    /**
     * 载入资源
     */
    SGResourceContainer.prototype.Load = function (resfile, innerResourceContainer, callback) {
        if (innerResourceContainer)
            this.m_InnerResourceContainer = innerResourceContainer;
        var that = this;
        //载入资源文件
        SGAppConfig.LoadConfigFile(resfile, function (err, result) {
            if (err)
                return callback(err);
            var lst = _.map(result, function (v) { return { "src": v.Src, "id": v.Key }; });
            //console.log(lst);
            //预加载器
            //manifest = g_resource;
            var loader = new createjs.LoadQueue(false);
            loader.addEventListener("complete", function () {
                //console.log("load resource completed");
                that.m_ResManifest = {};
                for (var _i = 0; _i < result.length; _i++) {
                    var res = result[_i];
                    //设置images
                    res["images"] = [loader.getResult(res.Key)];
                    //添加到m_ResManifest
                    that.m_ResManifest[res.Key] = res;
                }
                callback(null);
            });
            loader.loadManifest(lst, true, "_assets/art/");
        });
    };
    /**
     * 获取资源
     */
    SGResourceContainer.prototype.GetResource = function (key) {
        //优先查找当前资源
        var res = this.m_ResManifest[key];
        if (res)
            return res;
        //然后在内含资源容器中找
        if (this.m_InnerResourceContainer) {
            var res2 = this.m_InnerResourceContainer.GetResource(key);
            if (res2)
                return res2;
        }
        return null;
    };
    return SGResourceContainer;
})();
//# sourceMappingURL=SGResourceContainer.js.map