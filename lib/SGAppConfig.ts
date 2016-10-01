/**
 * Created by root on 16-9-22.
 */
declare class jQuery{
	static ajax(x);
}
/**
 * 提供读写应用程序配置的静态类
 */
class SGAppConfig {

	private static  g_LocaleID:number;
	//private static char g_VideoMode[4];
	//private static g_AppPath:string;
	private static g_SystemPath:string;
	private static  OptionList;

	/**
	 * 初始化
	 * @param {(err,result) => void} callback  结果回调
	 */
	public static Init(callback:(err) => void) {
		if (SGAppConfig.OptionList)return callback(null);

		SGAppConfig.g_SystemPath = "Config/system/";
		SGAppConfig.LoadConfigFile("system.json", (err, result) => {
			if (err) return callback(err);

			SGAppConfig.OptionList = result;
			SGAppConfig.g_LocaleID = parseInt(SGAppConfig.OptionList["LocaleID"]["value"]);
			//strcpy(g_VideoMode,OptionList->at("VideoMode"));	//strcpy(g_VideoMode,"gl");
			callback(null);
		});
	}

	/**
	 * 获取系统配置的值
	 * @param {string} key  键名(在系统配置文件中)
	 * @returns {string} 值
	 */
	public static GetValue(key:string):string {
		return SGAppConfig.OptionList[key]["value"];
	}

	/**
	 * 获取语言区域号
	 * @returns {number} 语言区域号
	 */
	public static GetLocaleID():number {
		return SGAppConfig.g_LocaleID;
	}

	/**
	 * 获取系统配置目录的绝对路径(末尾带"/")
	 * @returns {string} 系统配置目录的绝对路径
	 */
	public static GetSystemPath():string {
		return SGAppConfig.g_SystemPath;
	}

	/**
	 * 载入指定系统配置文件
	 * @param {string} pth  文件相对路径(在系统配置目录中)
	 * @param {(err,result) => void} callback  结果回调
	 */
	public static LoadConfigFile(pth:string, callback:(err, result) => void) {
		jQuery.ajax({
			dataType: "json",
			url: `${SGAppConfig.GetSystemPath()}${pth}?stamp=${new Date().getTime()}`,
			success: function (data) {
				callback(null, data);
			},
			error: function (jqXHR, textStatus, errorThrown) {
				//console.log(jqXHR.responseText + '(' + errorThrown + ')');
				callback(new Error(jqXHR.responseText + '(' + errorThrown + ')'), null);
			}
		});
	}


}


