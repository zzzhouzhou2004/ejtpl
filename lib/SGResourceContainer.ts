/// <reference path="../Scripts/typings/createjs/easeljs/easeljs.d.ts"/>
/// <reference path="../Scripts/typings/createjs/preloadjs/preloadjs.d.ts"/>
/// <reference path="./SGGlobal.ts"/>
/**
 * 定义资源类接口
 */
interface ISGResource {
	id:number;
	src:string;
}

/**
 * 资源容器类
 */
class SGResourceContainer {
	private m_InnerResourceContainer:SGResourceContainer;
	private m_ResManifest:any;

	/**
	 * 载入资源
	 */
	public Load(resfile:string, innerResourceContainer:SGResourceContainer, callback:(err) => void) {
		if (innerResourceContainer)this.m_InnerResourceContainer = innerResourceContainer;

		let that = this;
		//载入资源文件
		SGAppConfig.LoadConfigFile(resfile, (err, result) => {
			if (err) return callback(err);

			let lst=_.map(result, (v:any)=>{ return {"src": v.Src, "id": v.Key}; });
			//console.log(lst);
			//预加载器
			//manifest = g_resource;
			let loader = new createjs.LoadQueue(false);
			loader.addEventListener("complete", ()=> {
				//console.log("load resource completed");
				that.m_ResManifest = {};
				for (let res of result) {
					//设置images
					res["images"] = [loader.getResult(res.Key)];
					//添加到m_ResManifest
					that.m_ResManifest[res.Key]=res;
				}
				callback(null);
			});
			loader.loadManifest(lst, true, "_assets/art/");
		});
	}

	/**
	 * 获取资源
	 */
	public GetResource(key:string):any {
		//优先查找当前资源
		let res:any = this.m_ResManifest[key];
		if (res) return res;

		//然后在内含资源容器中找
		if (this.m_InnerResourceContainer) {
			let res2:any = this.m_InnerResourceContainer.GetResource(key);
			if (res2) return res2;
		}

		return null;
	}

}


