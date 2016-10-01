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
class SGEntity {

    ///**
    // * 非法ID号
    // */
    //public static INVALIDID:number=SGCONST_INVALIDID_UNSIGNED;
    //
    //public ID:number;
    public Name: string;
    public Caption: string;
    protected m_X: number;
    public get X(): number {return this.m_X;};
    public set X(val:number) {
        this.m_X=val;
        if(this.m_SpriteObject)this.m_SpriteObject.x = this.m_X;
    };
    protected m_Y: number;
    public get Y(): number {return this.m_Y;};
    public set Y(val:number) {
        this.m_Y=val;
        if(this.m_SpriteObject)this.m_SpriteObject.y = this.m_Y;
    };
    protected m_Width: number;
    public get Width(): number {return this.m_Width;};
    protected m_Height: number;
    public get Height(): number {return this.m_Height;};
    public ScaleSize(widthscale:number,heightscale:number) {
        this.SpriteObject.setTransform(this.X, this.Y, widthscale, heightscale);
        let rc=this.SpriteObject.getTransformedBounds();
        this.m_Width=rc.width;
        this.m_Height=rc.height;
    };
    public HP: number;
    public Visible: boolean;
    public Clickable: boolean;
    //unsigned int     AnimFrameRate; //Milliseconds
    //bool	AnimLoop;
    public CanShot: boolean;
    public HasShot: boolean;
    public MovingFrameRate: number; //Milliseconds

    //public AnimationStateList: SGAnimationState[];
    protected m_CurrentAnimState: string;

    //protected     Anim_Control:SGAnimation;
    protected m_SpriteObject: any;
    public get SpriteObject(): any {
        return this.m_SpriteObject;
    };

    //CSGSurface*    Surf_Entity;
    //int    m_SurfaceID;

    //protected    OldTimeMoving;
    //protected    OldTimeLooping;

    protected m_pACTState: any;

    //bool    m_AnimFrameChanged;
    //bool    m_AnimStateChanged;
    //标识是否ACTState私有Entity
    protected m_StatePrivate: boolean;

    //private     InnerIndex:number;	//内部j索引

	/**
	 * 构造器
	 */
    constructor(name: string) {
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

	/**
	 * 载入
	 */
    public Load(element: any, spriteObject) {
        this.m_SpriteObject = spriteObject;
        this.m_SpriteObject.name = this.Name;
        _.extend(this, element);

        this.X =eval(element.X);	//计算表达式
        this.Y =  eval(element.Y);	//计算表达式

    }

    /**
     * 切换动画状态
     */
    public SwitchAnimationState(animstate: string) {
        this.SpriteObject.gotoAndPlay(animstate);
        this.m_CurrentAnimState =  animstate;
    }


}
