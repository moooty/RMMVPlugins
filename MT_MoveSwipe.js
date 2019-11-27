 //=============================================================================
// MT_MoveSwipe.js
// キャラクターの移動をスワイプ移動にする(スマホ向け)
// ----------------------------------------------------------------------------
// (C) 2019 Moooty
//=============================================================================


/*:
 * @plugindesc Change player's movement to swipe.
 * @author Moooty
 *
 * @param activateSwitch
 * @text the switch is on, activate swipe move.
 * @type switch
 *
 * @param showDestination
 * @text show rect for destination.
 * @type select
 * @default 0
 * 
 * @option Show
 * @value 0
 *
 * @option Hidden(when activate swipe move)
 * @value 1
 *
 * @option Hidden
 * @value 2
 *
 * @param moveRange
 * @text movement threshold.
 * @type number
 * @default 45
 *
 * @param touchCircleRadius
 * @text circle radius when touched display.
 * @type number
 * @default 36
 *
 *
 * @help
 * === Description ===
 * Change player's movement for swipe.
 * 
 * Nothing plugin commnad this plugin.
 * 
 * 
 * === Change Log ===
 * Sep  5, 2019 ver1.00 initial release
 * 
 * === Manual & License(Japanese) ===
 * https://www.5ing-myway.com/rpgmaker-plugin-confirm-escape/
 * 
 */

/*:ja
 * @plugindesc スワイプ移動プラグイン
 * @author むーてぃ
 *
 * @param activateSwitch
 * @text スイッチがONの時にスワイプ移動が有効になります。
 * @type switch
 *
 * @param showDestination
 * @text デフォルトの移動先の□を表示するか
 * @type select
 * @default 0
 * 
 * @option 常に表示
 * @value 0
 *
 * @option スワイプ移動が有効の時のみ非表示
 * @value 1
 *
 * @option 常に非表示
 * @value 2
 *
 * @param moveRange
 * @text 移動しきい値(座標がしきい値以上に移動したときにスワイプしたとみなします)
 * @type number
 * @default 45
 *
 * @param touchCircleRadius
 * @text タッチした時に表示される円の半径
 * @type number
 * @default 36
 *
 * @help
 * === 説明 ===
 * キャラクターの移動方法をスワイプ移動にするためのプラグインです。
 * 
 * このプラグインにはプラグインコマンドはありません。
 * 
 * === 更新履歴 ===
 * 2019/9/5  ver1.00 初版
 *
 * === マニュアル＆ライセンス ===
 * https://www.5ing-myway.com/rpgmaker-plugin-confirm-escape/
 * 
 */

var Imported = Imported || {};
Imported['MT_MoveSwipe'] = true;

(function(){
    'use strict';

    // 定数
    const PLUGIN_NAME     = "MT_MoveSwipe";
    const HIDDEN = 1;
    const ALWAYS_HIDDEN = 2;

    // パラメータ
    var parameters        = PluginManager.parameters(PLUGIN_NAME);

    var activateSwitch    = getParameterValue(parameters['activateSwitch'], 0);    
    var showDestination   = getParameterValue(parameters['showDestination'], 0);
    var touchCircleRadius = getParameterValue(parameters['touchCircleRadius'], 36);
    var moveRange         = getParameterValue(parameters['moveRange'], 45);
    
    // ---------- 基本システムの変更 ここから ----------
    var originalX;
    var originalY;
    var touchX;
    var touchY;
    var swiped;
    var triggered;
    var _Scene_Map_processMapTouch = Scene_Map.prototype.processMapTouch;
    Scene_Map.prototype.processMapTouch = function() {
	if($gameSwitches.value(activateSwitch)){
	    // タッチ開始時に原点座標を取得しタッチ位置を描画
	    if (TouchInput.isTriggered()){
		// アイテムスロットクリック時は無効
		if(this._mapItemSlotWindow){
		    if(this._mapItemSlotWindow.contains(TouchInput.x, TouchInput.y)){
			return;
		    }

		}
		// 押した瞬間を取得しておかないと
		// メッセージ送りでクリックした時にもonTouchActionが呼びだされてしまう
		triggered = true;
		originalX = TouchInput.x;
		originalY = TouchInput.y;

		this._spriteset.drawTouchCenter(originalX, originalY);
	    }    


	    // タッチ中は座標を更新し続ける
 	    if(TouchInput.isPressed()){
		touchX = TouchInput.x;
		touchY = TouchInput.y;

		// 現在のタッチ座標が原点座標と異なる場合のみ移動
		if(originalX != null && originalY != null){
		    if(touchX !== originalX || touchY !== originalY){
			this._spriteset.drawTouchOuter(touchX, touchY);
			this.processMapSwipe();
			swiped = true;
		    }
		}
		
		this._touchCount++;
	    }

	    if(TouchInput.isReleased()){
		if(triggered && !swiped){
		    $gamePlayer.onTouchAction();

		}
		
		this._touchCount = 0;
		this._spriteset.clearTouchSprites();
		triggered = false;
		swiped = false;
		originalX = null;
		originalY = null;
	    }
	}else{
	    _Scene_Map_processMapTouch.call(this);
	}

    };

    // スワイプ処理
    Scene_Map.prototype.processMapSwipe = function() {
	if (this._touchCount === 0 || this._touchCount >= 15) {
	    var diffX = TouchInput.x - originalX;
	    var diffY = TouchInput.y - originalY;
	    
	    if(Math.abs(diffX) >= moveRange / 2){
		diffX = (diffX > 0) ? 1 : -1;
	    } else {
		diffX = 0;
	    }
	    
	    if(Math.abs(diffY) >= moveRange){
		diffY = (diffY > 0) ? 1 : -1;
	    } else {
		diffY = 0;
	    }
	    
	    $gameTemp.setDestination($gamePlayer.x + diffX, $gamePlayer.y + diffY);		
	}
    };

    // タッチ時のアクションを追加
    // 元々のtriggerTouchAction→スワイプ移動中に呼びだし
    // onTouchAction→移動せずにタッチした時のみ呼びだし
    
    // イベント起動範囲を拡張：
    // イベントトリガーが「決定キー」で前方3マス・左右のイベントを起動
    // ※複数起動できるものがあった場合、先に起動条件を満たしたものだけ起動
    Game_Player.prototype.onTouchAction = function(){
	if (this.canStartLocalEvents()) {
            var direction = this.direction();
	    var triggerTouch = [0];
	    
	    var frontX = $gameMap.roundXWithDirection($gamePlayer.x, direction);
	    var frontY = $gameMap.roundYWithDirection($gamePlayer.y, direction);

            this.startMapEvent(frontX    , frontY, triggerTouch, true);
	    const dirDown = 2;
	    const dirLeft = 4;
	    const dirRight = 6;
	    const dirUp = 8;
	    if(direction === dirDown || direction === dirUp){
		this.startMapEvent(frontX - 1, frontY, triggerTouch, true);
		this.startMapEvent(frontX + 1, frontY, triggerTouch, true);
		this.startMapEvent($gamePlayer.x - 1, $gamePlayer.y, triggerTouch, true);
		this.startMapEvent($gamePlayer.x + 1, $gamePlayer.y, triggerTouch, true);
	    }

	    if(direction === dirLeft || direction === dirRight){
		this.startMapEvent(frontX, frontY - 1, triggerTouch, true);
		this.startMapEvent(frontX, frontY + 1, triggerTouch, true);
		this.startMapEvent($gamePlayer.x, $gamePlayer.y - 1, triggerTouch, true);
		this.startMapEvent($gamePlayer.x, $gamePlayer.y + 1, triggerTouch, true);		
	    }	   

	}
	return $gameMap.setupStartingEvent();
    };

    // 決定ボタンでイベントを起動した時にプレイヤーをイベントの方を向かせる
    var _Game_Player_startMapEvent = Game_Player.prototype.startMapEvent;
    Game_Player.prototype.startMapEvent = function(x, y, triggers, normal) {
	if(triggers.contains(0)){
	    var event = $gameMap.eventsXy(x, y)[0];
	    if(event != null){
		this.turnTowardCharacter(event);
	    }	    
	}
	_Game_Player_startMapEvent.apply(this, arguments);
    };    

    // ****************************
    // スプライト
    // ****************************
    // UI用のスプライトを上層レイヤーに追加 
    Spriteset_Map.prototype.createUpperLayer = function() {
	Spriteset_Base.prototype.createUpperLayer.call(this);
	this.createUISprites();	
    };
    
    var _Sprite_Destination_update = Sprite_Destination.prototype.update;
    Sprite_Destination.prototype.update = function() {
	_Sprite_Destination_update.call(this);

	if(showDestination === ALWAYS_HIDDEN || (showDestination === HIDDEN && $gameSwitches.value(activateSwitch))){
	    this.visible = false;
	}
    };    
    // ----------基本システムの変更 ここまで ----------


    // ---------- スプライト描画メソッド追加 ここから ----------
    Spriteset_Map.prototype.createUISprites = function(){
	this._touchCenter = new Sprite();
	this._touchOuter = new Sprite();
	this.addChild(this._touchCenter);
	this.addChild(this._touchOuter);
    };
    
    Spriteset_Map.prototype.drawTouchCenter = function(x, y){
	this._touchCenter.bitmap = new Bitmap(touchCircleRadius * 2, touchCircleRadius * 2);
	this._touchCenter.bitmap.drawCircle(touchCircleRadius, touchCircleRadius, touchCircleRadius, 'rgba(255,255,255,0.5)');
	
	this._touchCenter.x = x;
	this._touchCenter.y = y;

	this._touchCenter.anchor.x = 0.5;
	this._touchCenter.anchor.y = 0.5;
    };
    

    Spriteset_Map.prototype.drawTouchOuter = function(x, y){
	if(this._touchCenter){
	    var radius = touchCircleRadius / 2;
	    this._touchOuter.bitmap = new Bitmap(radius, radius);
	    this._touchOuter.bitmap.drawCircle(radius / 2, radius / 2, radius / 2, 'rgba(0,0,255,0.5)');

	    var radian =  Math.atan2(y - this._touchCenter.y, x - this._touchCenter.x);
	    this._touchOuter.x = this._touchCenter.x + (touchCircleRadius * Math.cos(radian));
	    this._touchOuter.y = this._touchCenter.y + (touchCircleRadius * Math.sin(radian));

	    this._touchOuter.anchor.x = 0.5;
	    this._touchOuter.anchor.y = 0.5;	  
	}
    };

    Spriteset_Map.prototype.clearTouchSprites = function(){
	if(this._touchCenter.bitmap){
	    this._touchCenter.bitmap.clear();
	}
	
	if(this._touchOuter.bitmap){
	    this._touchOuter.bitmap.clear();
	}
    };
    // ---------- スプライト描画メソッド追加 ここまで ----------

    // ---------- パラメータ取得用関数ここから ----------
    // @type numberのパラメータでも文字列を入れることができてしまう対策
    function getParameterValue(param, defaultValue){
	    var result = Number(param || defaultValue);
	
	    if(Number.isNaN(result)){
	        result = defaultValue;
	    }

	    return result;
    };
    // ---------- パラメータ取得用関数ここまで ----------
})();
