/// <reference path="../Scripts/typings/createjs/easeljs/easeljs.d.ts"/>
/// <reference path="../Scripts/typings/createjs/preloadjs/preloadjs.d.ts"/>
/// <reference path="./SGAppConfig.ts"/>
/// <reference path="./SGResourceContainer.ts"/>
/// <reference path="./ACT/SGACTMachine.ts"/>
/**
 * Created by root on 16-9-22.
 */
/**
 * 应用程序类
 */
class SGApp {

	/**
	 * 获取舞台宽度
	 */
    public static get StageWidth(): number {
        return SGApp.g_StageWidth;
    };
	/**
	 * 获取舞台高度
	 */
    public static get StageHeight(): number {
        return SGApp.g_StageHeight;
    };
	/**
	 * 获取ACTMachine
	 */
    public static get ACTMachine(): SGACTMachine {
        return SGApp.g_ACTMachine;
    };

    //private ACTMachine:SGACTMachine;
    private static ResContainer: SGResourceContainer;
    private static stage;
    private static g_StageWidth: number;
    private static g_StageHeight: number;
    private static sky;
    private static grant;
    private static bitmapHelper;
    private static loader;
    private static g_ACTMachine: SGACTMachine;

	/**
	 * 初始化
	 * @param {(err,result) => void} callback  结果回调
	 */
    public static Init(callback: (err) => void) {
        if (SGApp.ResContainer) return callback(null);

        SGApp.ShowDistractor(null);
        SGAppConfig.Init((err) => {
            if (err) return callback(err);

            console.log('SGAppConfig.Init!');
            if (document.body) {
                SGApp.setupEmbed();
            }
            else {
                document.addEventListener("DOMContentLoaded", SGApp.setupEmbed);
            }

            // create a new stage and point it at our canvas:
            SGApp.stage = new createjs.Stage("testCanvas");
            // grab canvas width and height for later calculations:
            SGApp.g_StageWidth = SGApp.stage.canvas.width;
            SGApp.g_StageHeight = SGApp.stage.canvas.height;
            SGApp.g_ACTMachine = new SGACTMachine(SGApp.stage);

            //载入公共资源
            SGApp.ResContainer = new SGResourceContainer();
            SGApp.ResContainer.Load("Resource/resource.json", null, (err) => {
                if (err) return callback(err);

                SGApp.ACTMachine.SetCurrentACT(0, SGApp.ResContainer, (err) => {
                    SGApp.ACTMachine.SetCurrentACTState(1);
	                console.log("aaa");
	                //SGApp.handleComplete();

	                // enable touch interactions if supported on the current device:
	                createjs.Touch.enable(SGApp.stage);
	                // enable mouse over / out events, required for button rollovers
	                SGApp.stage.enableMouseOver(10);

//console.log(SGApp.ResContainer.GetResource("bg"));
	                //SGApp.sky = new createjs.Bitmap(SGApp.ResContainer.GetResource("bg").images[0]);
	                //SGApp.stage.addChild(SGApp.sky);//, grant);
                    SGApp.stage.addEventListener("stagemousedown", ()=>{
                        SGApp.ACTMachine.SetCurrentACTState(2);

                    });

	                createjs.Ticker.timingMode = createjs.Ticker.RAF;
	                createjs.Ticker.addEventListener("tick", SGApp.tick);

                    callback(null);
                });
            });
        });
    }

    private static handleComplete() {
        //setTimeout(function () {
        SGApp.HideDistractor();
        //}, 5000);

        SGApp.sky = new createjs.Bitmap(SGApp.ResContainer.GetResource("bg").images);

        var spriteSheet = new createjs.SpriteSheet({
            framerate: 30,
            "images": [SGApp.loader.getResult("grant")],
            "frames": {
                //"regX":   0,
                "height": 292,
                "count": 64,
                //"regY":   0,
                "width": 165
            },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):
            // start, end, next*, speed*
            "animations": {
                "run": [0, 25, "run", 1.5],
                "jump": [26, 63, "run"]
            }
        });
        //		grant = new createjs.Sprite(spriteSheet, "run");
        //		grant.y = 35;
        SGApp.grant = new createjs.Sprite(spriteSheet, "run");
        SGApp.grant.x = SGApp.stage.canvas.width / 2 - 82;
        SGApp.grant.y = 22;


        // Add Grant to the stage, and add it as a listener to Ticker to get updates each frame.
        SGApp.stage.addChild(SGApp.sky);//, grant);
        //SGApp.stage.addEventListener("stagemousedown", SGApp.handleJumpStart);

        // enable touch interactions if supported on the current device:
        createjs.Touch.enable(SGApp.stage);
        // enable mouse over / out events, required for button rollovers
        SGApp.stage.enableMouseOver(10);

        // spritesheet "bitmap" button:
        var btn1 = new createjs.SpriteSheet({
            "images": [SGApp.loader.getResult("btn1")],
            frames: {
                width: 300,
                height: 100
            },
            animations: {
                out: 0,
                over: 1,
                down: 2
            }
        });
        var bitmapButton = new createjs.Sprite(btn1, "up");
        SGApp.stage.addChild(bitmapButton).set({
            x: 50,
            y: 50
        });
        SGApp.bitmapHelper = new createjs.ButtonHelper(bitmapButton);
        bitmapButton.on("click", function() {
            alert(SGAppConfig.GetValue("StartACT"));
            //                bitmapHelper.enabled = !bitmapHelper.enabled;
            //			vectorHelper.enabled = !vectorHelper.enabled;
            //			vectorButton.alpha = 0.5 + vectorHelper.enabled * 0.5;
            SGApp.grant.gotoAndPlay("jump");
        });

        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.addEventListener("tick", SGApp.tick);
    }


    //private static handleJumpStart() {
    //	grant.gotoAndPlay("jump");
    //}

    private static tick(event) {
        //var deltaS = event.delta / 1000;
        //var position = SGApp.grant.x + 150 * deltaS;
        //
        //var grantW = SGApp.grant.getBounds().width * SGApp.grant.scaleX;
        //            grant.x = (position >= w + grantW) ? -grantW : position;

        SGApp.stage.update(event);
    }

    private static ShowDistractor(id) {
        var div: any = id ? document.getElementById(id) : document.querySelector("div canvas").parentNode;
        div.className += " loading";
    }

    private static HideDistractor() {
        var div: any = document.querySelector(".loading");
        div.className = div.className.replace(/\bloading\b/);
    }

    private static setupEmbed() {
        if (window.top != window) {
            document.body.className += " embedded";
        }
    }

}
