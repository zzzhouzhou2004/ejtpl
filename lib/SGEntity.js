/// <reference path="../Scripts/typings/createjs/easeljs/easeljs.d.ts"/>
/// <reference path="../Scripts/typings/createjs/preloadjs/preloadjs.d.ts"/>
/// <reference path="../Scripts/typings/underscore/underscore.d.ts"/>
/// <reference path="./SGGlobal.ts"/>
/**
 * Created by root on 16-9-22.
 */
//class SGAnimationState {
//    StateIndex: number;
//    Playtime: number;
//    PlayOnlyOnce: boolean;
//    ToState: number;
//    MaxFrames: number;
//    AnimFrameRate: number;
//    AnimLoop: boolean;
//    MovingFrameRate: number;
//    //SGSoundEntry SoundEntry;
//    // SoundLoop:boolean;
//    //SGAnimationState(){SoundChunk=NULL;}
//}
/**
 * 动画元素类
 */
var SGEntity = (function () {
    //private     InnerIndex:number;	//内部j索引
    /**
     * 构造器
     */
    function SGEntity(name) {
        //this.m_SurfaceID = -1;
        //Surf_Entity = NULL;
        this.m_X = 3;
        this.m_Y = 0;
        this.Visible = false;
        this.Clickable = false;
        this.m_Width = 0;
        this.m_Height = 0;
        this.HP = 1;
        this.CanShot = false;
        this.HasShot = false;
        //m_AnimFrameChanged=m_AnimStateChanged = false;
        //this.CurrentAnimStateIndex = 0;
        //this.ID = Id;
        //AnimFrameRate       = 0;
        //AnimLoop       = true;
        this.MovingFrameRate = 0;
        //this.OldTimeLooping =0;this.OldTimeMoving = 0;
        //this.InnerIndex = -1;
        this.m_StatePrivate = false;
        this.Name = name;
        this.Caption = name;
    }
    Object.defineProperty(SGEntity.prototype, "X", {
        get: function () { return this.m_X; },
        set: function (val) {
            this.m_X = val;
            if (this.m_SpriteObject)
                this.m_SpriteObject.x = this.m_X;
        },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(SGEntity.prototype, "Y", {
        get: function () { return this.m_Y; },
        set: function (val) {
            this.m_Y = val;
            if (this.m_SpriteObject)
                this.m_SpriteObject.y = this.m_Y;
        },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(SGEntity.prototype, "Width", {
        get: function () { return this.m_Width; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(SGEntity.prototype, "Height", {
        get: function () { return this.m_Height; },
        enumerable: true,
        configurable: true
    });
    ;
    SGEntity.prototype.ScaleSize = function (widthscale, heightscale) {
        this.SpriteObject.setTransform(this.X, this.Y, widthscale, heightscale);
        var rc = this.SpriteObject.getTransformedBounds();
        this.m_Width = rc.width;
        this.m_Height = rc.height;
    };
    ;
    Object.defineProperty(SGEntity.prototype, "SpriteObject", {
        get: function () {
            return this.m_SpriteObject;
        },
        enumerable: true,
        configurable: true
    });
    ;
    /**
     * 载入
     */
    SGEntity.prototype.Load = function (element, spriteObject) {
        this.m_SpriteObject = spriteObject;
        this.m_SpriteObject.name = this.Name;
        _.extend(this, element);
        this.X = eval(element.X); //计算表达式
        this.Y = eval(element.Y); //计算表达式
    };
    /**
     * 切换动画状态
     */
    SGEntity.prototype.SwitchAnimationState = function (animstate) {
        this.SpriteObject.gotoAndPlay(animstate);
        this.m_CurrentAnimState = animstate;
    };
    return SGEntity;
})();
//# sourceMappingURL=SGEntity.js.map