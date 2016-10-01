/// <reference path="../../Scripts/typings/createjs/easeljs/easeljs.d.ts"/>
/// <reference path="../../Scripts/typings/createjs/preloadjs/preloadjs.d.ts"/>
/// <reference path="../../Scripts/typings/underscore/underscore.d.ts"/>
/// <reference path="../SGAppConfig.ts"/>
/**
 * Created by root on 16-9-22.
 */
import DisplayObject = createjs.DisplayObject;
/**
 * ACTMachine
 */
class SGACTMachine {

    //private ACTMachine:SGACTMachine;
    private m_CurACT: number;
    private m_CurACTState: number;
    //private CSGACTState *m_CurACTState;
    private m_EntityList: any;
    //内含的资源容器
    public ResContainer: SGResourceContainer;
    private m_BitmapBg: any;
    //保存舞台的引用
    private m_Stage: createjs.Stage;
    //ACTState清单
    private m_ACTStateManifest: any;

	/**
	 * 构造器
	 */
    constructor(stage: createjs.Stage) {
        this.m_Stage = stage;
        this.m_CurACT = -1;
        this.m_CurACTState = -1;
    }

	/**
	 * 获取ACT ID
	 */
    public GetACTID(): number {
        return this.m_CurACT;
    }

	/**
	 * 设置当前ACT
	 */
    public SetCurrentACT(actID: number, appResContainer: SGResourceContainer, callback: (err) => void) {
        //CleanupACT();
        this.LoadACT(actID, appResContainer, callback);
    }

	/**
	 * 设置当前ACT状态
	 */
    public SetCurrentACTState(stateID: number) {
        let oldstateID = this.m_CurACTState;
        let actstate = this.m_ACTStateManifest[stateID];
        if (!this.m_BitmapBg || actstate.Background != this.m_BitmapBg.Key) {
            //移除旧背景
            if (this.m_BitmapBg) this.m_Stage.removeChild(this.m_BitmapBg.Value);
            //创建并加入新背景
            let bg2: createjs.Bitmap = new createjs.Bitmap(this.ResContainer.GetResource(actstate.Background).images[0]);
            this.m_BitmapBg = { Key: actstate.Background, Value: bg2 };
            // Add Grant to the stage, and add it as a listener to Ticker to get updates each frame.
            this.m_Stage.addChild(this.m_BitmapBg.Value);
        }

        //处理Entities
        for (let elm of actstate.Entities) {
            let entity: SGEntity = this.m_EntityList[elm.Name];
            entity.X = eval(elm.X);
            entity.Y = eval(elm.Y);
            if (elm.WidthScale && elm.HeightScale) entity.ScaleSize(elm.WidthScale, elm.HeightScale);
            if (elm.AnimState) entity.SwitchAnimationState(elm.AnimState);
        }
        let oldNames: string[] = (oldstateID >= 0 ? _.pluck(this.m_ACTStateManifest[oldstateID].Entities, "Name") : []);
        let newNames: string[] = _.pluck(actstate.Entities, "Name");
        //移除旧Entity
        let outNames: string[] = _.difference(oldNames, newNames);
        for (let elm of outNames) {
            //let xxx=this.m_Stage.getChildByName(elm);
            this.m_Stage.removeChild(this.m_Stage.getChildByName(elm));
        }
        //添加新Entity
        let addNames: string[] = _.difference(newNames, oldNames);
        for (let elm of addNames) {
            this.m_Stage.addChild(this.m_EntityList[elm].SpriteObject);
        }

        this.m_CurACTState = stateID;
    }

	/**
	 * 载入当前ACT
	 */
    public LoadACT(actID: number, appResContainer: SGResourceContainer, callback: (err) => void) {
        let that = this;
        that.ResContainer = new SGResourceContainer();
        //载入当前ACT资源
        that.ResContainer.Load(that.GetResourceConfigfile(actID), appResContainer, (err) => {
            if (err) return callback(err);

            //载入当前ACT配置
            SGAppConfig.LoadConfigFile(that.GetACTConfigfile(actID), (err, result) => {
                if (err) return callback(err);

                that.m_ACTStateManifest = _.indexBy(result, "StateID");
                //载入ACT所有Entity
                let Entities = _.map(result, (actstate: any) => {
                    return actstate.Entities;
                });
                Entities = _.flatten(Entities);
                that.m_EntityList = {};
                for (let elm of Entities) {
                    if (that.m_EntityList[elm.Name]) continue;
                    let entity = new SGEntity(elm.Name);
                    let spriteSheet = new createjs.SpriteSheet(that.ResContainer.GetResource(elm.ResKey));
                    //		grant = new createjs.Sprite(spriteSheet, "run");
                    //		grant.y = 35;
                    let spt: createjs.Sprite = new createjs.Sprite(spriteSheet, elm.AnimState);
                    //spt.x =eval( elm.X);
                    //spt.y = eval( elm.Y);


                    // Add Grant to the stage, and add it as a listener to Ticker to get updates each frame.
                    //SGApp.stage.addChild(spt);//, grant);
                    //SGApp.stage.addEventListener("stagemousedown", SGApp.handleJumpStart);
                    entity.Load(elm, spt);
                    that.m_EntityList[entity.Name] = entity;
                }


                that.m_CurACT = actID;
                callback(null);
            });
        });

    }

	/**
	 * 清理ACT
	 */
    public CleanupACT() {
        //暂时无需特别清理ACT
    }

    private GetResourceConfigfile(actID: number = -1): string {
        return `ACTs/ACT_${actID >= 0 ? actID : this.m_CurACT}/resource.json`;
    }

    private GetACTConfigfile(actID: number = -1): string {
        return `ACTs/ACT_${actID >= 0 ? actID : this.m_CurACT}/ACT.json`;
    }

    ///**
    // * 获取ACT状态ID
    // */
    //public GetACTStateID():number {
    //	return this.m_CurACTState?m_CurACTState.GetStateID():-1;
    //}


}
