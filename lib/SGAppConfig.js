/**
 * 提供读写应用程序配置的静态类
 */
var SGAppConfig = (function () {
    function SGAppConfig() {
    }
    /**
     * 初始化
     * @param {(err,result) => void} callback  结果回调
     */
    SGAppConfig.Init = function (callback) {
        if (SGAppConfig.OptionList)
            return callback(null);
        SGAppConfig.g_SystemPath = "Config/system/";
        SGAppConfig.LoadConfigFile("system.json", function (err, result) {
            if (err)
                return callback(err);
            SGAppConfig.OptionList = result;
            SGAppConfig.g_LocaleID = parseInt(SGAppConfig.OptionList["LocaleID"]["value"]);
            //strcpy(g_VideoMode,OptionList->at("VideoMode"));	//strcpy(g_VideoMode,"gl");
            callback(null);
        });
    };
    /**
     * 获取系统配置的值
     * @param {string} key  键名(在系统配置文件中)
     * @returns {string} 值
     */
    SGAppConfig.GetValue = function (key) {
        return SGAppConfig.OptionList[key]["value"];
    };
    /**
     * 获取语言区域号
     * @returns {number} 语言区域号
     */
    SGAppConfig.GetLocaleID = function () {
        return SGAppConfig.g_LocaleID;
    };
    /**
     * 获取系统配置目录的绝对路径(末尾带"/")
     * @returns {string} 系统配置目录的绝对路径
     */
    SGAppConfig.GetSystemPath = function () {
        return SGAppConfig.g_SystemPath;
    };
    /**
     * 载入指定系统配置文件
     * @param {string} pth  文件相对路径(在系统配置目录中)
     * @param {(err,result) => void} callback  结果回调
     */
    SGAppConfig.LoadConfigFile = function (pth, callback) {
        jQuery.ajax({
            dataType: "json",
            url: "" + SGAppConfig.GetSystemPath() + pth + "?stamp=" + new Date().getTime(),
            success: function (data) {
                callback(null, data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //console.log(jqXHR.responseText + '(' + errorThrown + ')');
                callback(new Error(jqXHR.responseText + '(' + errorThrown + ')'), null);
            }
        });
    };
    return SGAppConfig;
})();
//# sourceMappingURL=SGAppConfig.js.map