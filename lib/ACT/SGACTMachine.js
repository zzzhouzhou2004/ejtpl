/// <reference path="../../Scripts/typings/createjs/easeljs/easeljs.d.ts"/>
/// <reference path="../../Scripts/typings/createjs/preloadjs/preloadjs.d.ts"/>
/// <reference path="../../Scripts/typings/underscore/underscore.d.ts"/>
/// <reference path="../SGAppConfig.ts"/>
/**
 * Created by root on 16-9-22.
 */
var DisplayObject = createjs.DisplayObject;
/**
 * ACTMachine
 */
var SGACTMachine = (function () {
    /**
     * 构造器
     */
    function SGACTMachine(stage) {
        this.m_Stage = stage;
        this.m_CurACT = -1;
        this.m_CurACTState = -1;
    }
    /**
     * 获取ACT ID
     */
    SGACTMachine.prototype.GetACTID = function () {
        return this.m_CurACT;
    };
    /**
     * 设置当前ACT
     */
    SGACTMachine.prototype.SetCurrentACT = function (actID, appResContainer, callback) {
        //CleanupACT();
        this.LoadACT(actID, appResContainer, callback);
    };
    /**
     * 设置当前ACT状态
     */
    SGACTMachine.prototype.SetCurrentACTState = function (stateID) {
        var oldstateID = this.m_CurACTState;
        var actstate = this.m_ACTStateManifest[stateID];
        if (!this.m_BitmapBg || actstate.Background != this.m_BitmapBg.Key) {
            //移除旧背景
            if (this.m_BitmapBg)
                this.m_Stage.removeChild(this.m_BitmapBg.Value);
            //创建并加入新背景
            var bg2 = new createjs.Bitmap(this.ResContainer.GetResource(actstate.Background).images[0]);
            this.m_BitmapBg = { Key: actstate.Background, Value: bg2 };
            // Add Grant to the stage, and add it as a listener to Ticker to get updates each frame.
            this.m_Stage.addChild(this.m_BitmapBg.Value);
        }
        //处理Entities
        for (var _i = 0, _a = actstate.Entities; _i < _a.length; _i++) {
            var elm = _a[_i];
            var entity = this.m_EntityList[elm.Name];
            entity.X = eval(elm.X);
            entity.Y = eval(elm.Y);
            if (elm.WidthScale && elm.HeightScale)
                entity.ScaleSize(elm.WidthScale, elm.HeightScale);
            if (elm.AnimState)
                entity.SwitchAnimationState(elm.AnimState);
        }
        var oldNames = (oldstateID >= 0 ? _.pluck(this.m_ACTStateManifest[oldstateID].Entities, "Name") : []);
        var newNames = _.pluck(actstate.Entities, "Name");
        //移除旧Entity
        var outNames = _.difference(oldNames, newNames);
        for (var _b = 0; _b < outNames.length; _b++) {
            var elm = outNames[_b];
            //let xxx=this.m_Stage.getChildByName(elm);
            this.m_Stage.removeChild(this.m_Stage.getChildByName(elm));
        }
        //添加新Entity
        var addNames = _.difference(newNames, oldNames);
        for (var _c = 0; _c < addNames.length; _c++) {
            var elm = addNames[_c];
            this.m_Stage.addChild(this.m_EntityList[elm].SpriteObject);
        }
        this.m_CurACTState = stateID;
    };
    /**
     * 载入当前ACT
     */
    SGACTMachine.prototype.LoadACT = function (actID, appResContainer, callback) {
        var that = this;
        that.ResContainer = new SGResourceContainer();
        //载入当前ACT资源
        that.ResContainer.Load(that.GetResourceConfigfile(actID), appResContainer, function (err) {
            if (err)
                return callback(err);
            //载入当前ACT配置
            SGAppConfig.LoadConfigFile(that.GetACTConfigfile(actID), function (err, result) {
                if (err)
                    return callback(err);
                that.m_ACTStateManifest = _.indexBy(result, "StateID");
                //载入ACT所有Entity
                var Entities = _.map(result, function (actstate) {
                    return actstate.Entities;
                });
                Entities = _.flatten(Entities);
                that.m_EntityList = {};
                for (var _i = 0; _i < Entities.length; _i++) {
                    var elm = Entities[_i];
                    if (that.m_EntityList[elm.Name])
                        continue;
                    var entity = new SGEntity(elm.Name);
                    var spriteSheet = new createjs.SpriteSheet(that.ResContainer.GetResource(elm.ResKey));
                    //		grant = new createjs.Sprite(spriteSheet, "run");
                    //		grant.y = 35;
                    var spt = new createjs.Sprite(spriteSheet, elm.AnimState);
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
    };
    /**
     * 清理ACT
     */
    SGACTMachine.prototype.CleanupACT = function () {
        //暂时无需特别清理ACT
    };
    SGACTMachine.prototype.GetResourceConfigfile = function (actID) {
        if (actID === void 0) { actID = -1; }
        return "ACTs/ACT_" + (actID >= 0 ? actID : this.m_CurACT) + "/resource.json";
    };
    SGACTMachine.prototype.GetACTConfigfile = function (actID) {
        if (actID === void 0) { actID = -1; }
        return "ACTs/ACT_" + (actID >= 0 ? actID : this.m_CurACT) + "/ACT.json";
    };
    return SGACTMachine;
})();
//# sourceMappingURL=SGACTMachine.js.map