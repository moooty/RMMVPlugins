//=============================================================================
// MT_WaitGauge.js
// ----------------------------------------------------------------------------
// (C) 2019 Moooty
//=============================================================================
//

/*:
 * @plugindesc Set wait gauge(bar) for player / events.
 * @author Moooty
 *
 * @param gaugeWidth
 * @desc width of wait gauges.(Default: 100)
 * @type number
 * @min 0
 * @default 100
 * 
 * @param gaugeHeight
 * @desc height of wait gauges.(Default: 20)
 * @type number
 * @min 0
 * @default 20
 *
 * @param gaugeColor1
 * @desc Gauge gradient color1 in hex.(Default: #e08040)
 * @type text
 * @default #e08040
 * 
 * @param gaugeColor2
 * @desc Gauge gradient color1 in hex.(Default: #f0c040)
 * @type text
 * @default #f0c040
 *
 * @param windowPosition
 * @desc Display position for wait gauges.(Default: 2)
 * @type select
 * @default 2
 * 
 * @option bottom
 * @value 2
 *
 * @option right
 * @value 4
 *
 * @option left
 * @value 6
 * 
 * @option top
 * @value 8
 *
 * @param windowText
 * @desc Display text on wait gauge window.
 * @type string
 *
 * @param windowTextFontSize
 * @desc Font size for window text.(Default: 28)
 * @type number
 * @default 28
 *
 * @param displayWaitValue
 * @desc Display progress(%) on wait gauge.(Default: true)
 * @type boolean
 * @default true
 *
 * @param waitValueFontSize
 * @desc Font size for wait value.(Default: 28)
 * @type number
 * @default 28
 *
 * @param windowOpacity
 * @desc Window opacity. Set to 0, display wait gauge only.(Default：255)
 * @type number
 * @max 255
 * @min 0
 * @default 255
 * 
 * @param windowMargin
 * @desc Margin for wait gauge window.(Default: 5)
 * @type number
 * @default 5
 *
 * @param windowPadding
 * @desc Margin for wait gauge.(Default: 18)
 * @type number
 * @default 18
 *
 * @param movableWaiting
 * @desc Can move while waiting.(Default: true)
 * @type boolean
 * @default true
 *
 * @param moveWaitCancel
 * @desc Cancel wait when move.(Default: true)
 * @type boolean
 * @default true
 *
 * @param transferWaitCancel
 * @desc Cancel player wait gauge when Transfer Player.(Default: true)
 * @type boolean
 * @default true
 *
 * @param reWaitMode
 * @text Re-Wait Mode(set wait while waiting).(Default: Ignore)
 * @type select
 * @default 1
 * 
 * @option Cancel
 * @value 0
 *
 * @option Ignore
 * @value 1
 * 
 * @option Set
 * @value 2
 *
 * @param completeSE
 * @desc SE that play when wait completed.(Default: Decision1)
 * @type file
 * @require 1
 * @dir audio/se
 * @default Decision1
 *
 * @param cancelSE
 * @desc SE that play when wait canceled.(Default: Cancel1)
 * @type file
 * @require 1
 * @dir audio/se
 * @default Cancel1

 * @help
 * === Description ===
 * How to Use:
 * Set wait gauge by Set Movement Route(Script) or Plugin Command.
 * 
 * Set Movement Route(Script): 
 * To use variables, $gameVariables.value(Variables Index).
 *
 * this.setWaitCount(frame,start);
 *   Set wait gauge to target.
 *   [frame]
 *     display frame wait gauge(1second = 60frame)
 * 
 *   [start]
 *     start count(Normally: 0)
 *
 * this.setMovableWaiting(flg);
 *   Allow target move while waiting.
 *   [flg]
 *     true - allow move / false - prohibit move
 *
 * this.setMoveCancel(flg);
 *   Is wait canceled when target move while waiting.
 *   [flg]
 *     true - cancel / false - not cancel
 *
 * this.addCount(frame);
 *   Add target current wait.
 *   [frame]
 *     add frame.
 *
 * this.waitCancel();
 *   Cancel target wait gauge.
 * 
 *
 * Plugin Command：
 * To use variables, \V[Variable Index].
 * 
 * MT_Wait set TargetID frame movable moveCancel
 *   Set wait gauge to [TargetId].
 * 
 *   [TargetID]
 *     Target to set wait gauge.
 *     Player：0 or player
 *     Event  :Event ID
 * 
 *   [frame]
 *     Display frame for wait gauge.(1second = 60frame)
 *
 *   [movable]
 *     Allow target move while waiting.
 *     true - allow move / false - prohibit move
 *
 *   [moveCancel]
 *     Is cancel wait gauge when target move while waiting.
 *     true - cancel / false - not cancel
 * 
 *
 * MT_Wait cancel TargetID
 *   Cancel [TargetID]'s wait gauge.
 * 
 *   [TargetID]
 *     Target for wait gauge cancel.
 *     Player and all events: all
 *     Player: 0 or player
 *     Event: Event ID
 *
 * === Change Log ===
 * Nov  25, 2019 ver1.20 added call common event when wait completed or canceled.
 * Nov  25, 2019 ver1.10 changed to update only wait gauge.
 * June 19, 2019 ver1.00 initial release.
 *
 * === Manual & License(Japanese) ===
 * https://www.5ing-myway.com/rpgmaker-plugin-waitgauge/
 */

/*:ja
 * @plugindesc プレイヤーやイベントにウェイトゲージを表示する
 * @author むーてぃ
 *
 * @param gaugeWidth
 * @text ゲージ横幅
 * @desc ウェイトゲージの横幅(デフォルト：100)
 * @type number
 * @min 0
 * @default 100
 * 
 * @param gaugeHeight
 * @text ゲージ高さ
 * @desc ウェイトゲージの高さ(デフォルト：20)
 * @type number
 * @min 0
 * @default 20
 *
 * @param gaugeColor1
 * @text ゲージ色1
 * @desc ウェイトゲージのグラデーション左端のカラーコード
 * @type text
 * @default #e08040
 * 
 * @param gaugeColor2
 * @text ゲージ色2
 * @desc ウェイトゲージのグラデーション右端のカラーコード
 * @type text
 * @default #f0c040
 *
 * @param windowPosition
 * @text ウィンドウ表示場所
 * @desc ウェイトゲージの表示場所(デフォルト：対象の下)
 * @type select
 * @default 2
 * 
 * @option 対象の下
 * @value 2
 *
 * @option 対象の右
 * @value 4
 *
 * @option 対象の左
 * @value 6
 * 
 * @option 対象の上
 * @value 8
 *
 * @param windowText
 * @text ゲージ名
 * @desc ウェイトゲージ名
 * @type string
 *
 * @param windowTextFontSize
 * @text ゲージ名フォントサイズ
 * @desc ゲージ名のフォントサイズ(デフォルト：28)
 * @type number
 * @default 28
 *
 * @param displayWaitValue
 * @text ウェイト進捗表示
 * @desc ウェイトゲージに進捗値(%)を表示するか(デフォルト：true)
 * @type boolean
 * @default true
 *
 * @param waitValueFontSize
 * @text ウェイト進捗フォントサイズ
 * @desc 進捗値(%)のフォントサイズ(デフォルト：28)
 * @type number
 * @default 28
 *
 * @param windowOpacity
 * @text ウィンドウ不透明度
 * @desc ウィンドウ枠の不透明度。0でゲージだけ表示。(デフォルト：255)
 * @type number
 * @max 255
 * @min 0
 * @default 255
 * 
 * @param windowMargin
 * @text ウィンドウマージン
 * @desc ゲージ表示対象とゲージウィンドウ間の余白(デフォルト：5)
 * @type number
 * @default 5
 *
 * @param windowPadding
 * @text ウィンドウパディング
 * @desc ゲージウィンドウとウェイトゲージ間の余白(デフォルト：18)
 * @type number
 * @default 18
 *
 * @param movableWaiting
 * @text ウェイト中の移動
 * @desc ウェイトゲージ表示中の移動を許可するか(デフォルト：true)
 * @type boolean
 * @default true
 *
 * @param moveWaitCancel
 * @text 移動キャンセル
 * @desc 移動でウェイトをキャンセルするか(デフォルト：true)
 * @type boolean
 * @default true
 *
 * @param transferWaitCancel
 * @text 場所移動でキャンセル
 * @desc 場所移動でプレイヤーのウェイトゲージをキャンセルするか(イベントは設定の値にかかわらずリセット)(デフォルト：true)
 * @type boolean
 * @default true
 *
 * @param reWaitMode
 * @text ウェイト中のウェイト
 * @desc ウェイト中にウェイトを再度設定した時の処理(デフォルト：無視(先優先))
 * @type select
 * @default 1
 * 
 * @option キャンセル
 * @value 0
 *
 * @option 無視(先優先)
 * @value 1
 * 
 * @option 更新(後優先)
 * @value 2
 *
 * @param completeSE
 * @text ウェイト完了SE
 * @desc ウェイトが完了した時に再生するSE(デフォルト：Decision1)
 * @type file
 * @require 1
 * @dir audio/se
 * @default Decision1
 *
 * @param completeCommonEventId
 * @text ウェイト完了コモンイベント
 * @desc ウェイトが完了した時に実行するコモンイベント(デフォルト：なし)
 * @type common_event
 * @default 0
 *
 * @param cancelSE
 * @text ウェイトキャンセルSE
 * @desc ウェイトキャンセルされた時に再生するSE(デフォルト：Cancel1)
 * @type file
 * @require 1
 * @dir audio/se
 * @default Cancel1
 *
 * @param cancelCommonEventId
 * @text ウェイトキャンセルコモンイベント
 * @desc ウェイトがキャンセルされた時に実行するコモンイベント(デフォルト：なし)
 * @type common_event
 * @default 0
 * 
 * @help
 * === 説明 ===
 * 使い方:
 * 移動ルートの設定→スクリプトまたはプラグインコマンドからウェイトゲージを設定します。
 * 
 * 移動ルートの設定(スクリプト): 
 * 設定値にゲーム内変数を使いたい場合は$gameVariables.value(変数番号)を指定してください。
 *
 * this.setWaitCount(表示フレーム数,開始カウント数);
 *   対象にウェイトゲージを表示します。
 *   [表示フレーム数]
 *     ウェイトゲージの表示フレーム数(1秒 = 60フレーム)
 * 
 *   [開始カウント数]
 *     開始カウント(通常は0)
 *
 * this.setMovableWaiting(フラグ);
 *   対象がウェイトゲージ表示中に移動できるか設定します。
 *   [フラグ]
 *     true - 移動可能 / false - 移動禁止
 *
 * this.setMoveCancel(フラグ);
 *   対象のウェイトゲージ表示中に移動した場合ウェイトをキャンセルするか設定します。
 *   [フラグ]
 *     true - キャンセル / false - キャンセルされない
 *
 * this.addCount(値);
 *   対象の現在のウェイトカウントを[値]ぶん増減させます。
 *   [値]
 *     増減値(マイナス値で減少)
 *
 * this.waitCancel();
 *   対象のウェイトゲージをキャンセルさせます。
 * 
 *
 * プラグインコマンド：
 * ゲーム内変数を使用する場合は\V[変数番号]で指定してください。
 * 
 * MT_Wait set ターゲットID 表示フレーム数 移動可否 移動キャンセル
 *   [ターゲットID]に[表示フレーム数]の間ウェイトゲージを表示します。
 * 
 *   [ターゲットID]
 *     ウェイトゲージを表示する対象。
 *     プレイヤー：0またはplayer / イベント:イベントID。
 *     ゲーム内変数を使用可能です。
 * 
 *   [表示フレーム数]
 *     ウェイトゲージの表示フレーム数(1秒 = 60フレーム)
 *     ゲーム内変数を使用可能です。
 *
 *   [移動可否]
 *     ウェイトゲージが表示されているあいだ移動できるか
 *     true - 移動できる / false - 移動できない
 *
 *   [移動キャンセル]
 *     移動した時にウェイトゲージをキャンセルするか
 *     true - キャンセルする / false - キャンセルされない
 * 
 *
 * MT_Wait cancel ターゲットID
 *   [ターゲットID]のウェイトゲージをキャンセルします。
 * 
 *   [ターゲットID]
 *     ウェイトゲージをキャンセルする対象。
 *     すべて: all / プレイヤー：0またはplayer / イベント:イベントID
 *     ゲーム内変数を使用可能です。
 *
 * === 更新履歴 ===
 * 2019 11/25  ver1.20 ウェイト完了時、キャンセル時に指定のコモンイベントを呼びだせるように修正(プレイヤー・全イベント共通)
 * 2019/11/25  ver1.10 ウェイトゲージがあるものだけupdateするように変更(負荷軽減)
 * 2019/06/19  ver1.00 初版
 *
 * === マニュアル＆ライセンス ===
 * https://www.5ing-myway.com/rpgmaker-plugin-waitgauge/
 */

// メモ: 現時点の仕様
// ・ウェイト中にマップ移動
//   →プレイヤー：ウェイトが引き継がれる
//   →イベント  ：ウェイトが初期化される


var Imported = Imported || {};
Imported.MT_WaitGauge = true;

function MT_WaitGauge(){
    this.initialize.apply(this, arguments);
}


(function(){
    'use strict';
    const PLUGIN_NAME  = "MT_WaitGauge";
    const COMMAND_NAME = "MT_Wait";
    
    // デフォルト値の設定
    const DEFAULT_WINDOW_OPACITY = 255;
    const DEFAULT_WINDOW_MARGIN = 5;
    const DEFAULT_GAUGE_WIDTH = 100;
    const DEFAULT_GAUGE_HEIGHT = 20;
    const DEFAULT_GAUGE_COLOR1 = "#e08040";
    const DEFAULT_GAUGE_COLOR2 = "#f0c040";

    const REWAIT_CANCEL = 0;
    const REWAIT_IGNORE = 1;
    const REWAIT_UPDATE = 2;

    const POSITION_BOTTOM = 2;
    const POSITION_RIGHT = 4;
    const POSITION_LEFT = 6;    
    const POSITION_TOP = 8;
    

    // パラメータの取得
    var parameters         = PluginManager.parameters(PLUGIN_NAME);
    var gaugeWidth         = getParamNumber(parameters['gaugeWidth']         , DEFAULT_GAUGE_WIDTH);
    var gaugeHeight        = getParamNumber(parameters['gaugeHeight']        , DEFAULT_GAUGE_HEIGHT);
    var gaugeColor1        = getParamColorCode(parameters['gaugeColor1']     , DEFAULT_GAUGE_COLOR1);
    var gaugeColor2        = getParamColorCode(parameters['gaugeColor2']     , DEFAULT_GAUGE_COLOR2);
    var windowPosition     = getParamNumber(parameters['windowPosition']     , POSITION_BOTTOM);
    var windowText         = parameters['windowText'];
    var windowTextFontSize = getParamNumber(parameters['windowTextFontSize'] ,Window_Base.prototype.standardFontSize());
    var displayWaitValue   = getParamBoolean(parameters['displayWaitValue']  , true);
    var waitValueFontSize  = getParamNumber(parameters['waitValueFontSize']  , Window_Base.prototype.standardFontSize());
    var movableWaiting     = getParamBoolean(parameters['movableWaiting']    , true);
    var moveWaitCancel     = getParamBoolean(parameters['moveWaitCancel']    , true);
    var transferWaitCancel = getParamBoolean(parameters['transferWaitCancel'], true);
    var windowOpacity      = getParamNumber(parameters['windowOpacity']      , DEFAULT_WINDOW_OPACITY);
    var windowMargin       = getParamNumber(parameters['windowMargin']       , DEFAULT_WINDOW_MARGIN);
    var windowPadding      = getParamNumber(parameters['windowPadding']      , Window_Base.prototype.standardPadding());
    var reWaitMode         = getParamNumber(parameters['reWaitMode']         , REWAIT_IGNORE);

    var completeCommonEventId = getParamNumber(parameters['completeCommonEventId'], 0);
    var cancelCommonEventId = getParamNumber(parameters['cancelCommonEventId'], 0);
    
    // SEはプレイヤーとイベントで個別に設定できる方がいいかも？
    var completeSE        = parameters['completeSE'];
    var cancelSE          = parameters['cancelSE'];
    
    // ---------Scene_Map(rpg_scenes.js)を上書き ここから------------------
    // ウェイトゲージウィンドウの管理
    // メニューを開いて戻って来たときにも実行される
    var _Scene_Map_initialize = Scene_Map.prototype.initialize;
    Scene_Map.prototype.initialize = function() {
	    _Scene_Map_initialize.call(this);
	    this._waitGauges = [];
    };
   
    // ウェイトゲージが存在しない時は作成する
    Scene_Map.prototype.createWaitGaugeWindow = function(index, x, y){
	    var gauge = new MT_WaitGauge(x, y);
	    this._waitGauges[index] = gauge;
	    this.addWindow(gauge);
	    return gauge;
    };

    // ウェイトゲージ更新処理を追加
    var _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function(){
	    this.updateWaitGauges();	
	    _Scene_Map_update.call(this);
    };

    // ウェイトゲージがあるものだけ更新するように修正
    Scene_Map.prototype.updateWaitGauges = function(){
	// プレイヤー
	if($gamePlayer.hasWaitCount()){
	    this.updateWaitGauge($gamePlayer, 0);
	}	

	// イベント
	for(var i = 1; i < $gameMap.events().length + 1; i++ ){
	    var event = $gameMap.event(i);
	    if(event != null){
		if(event.hasWaitCount()){
		    this.updateWaitGauge(event, i);
		}
	    }
	}
    };

    // Game_Characterからウェイト値を取得してゲージを更新する
    // Scene_Map._waitGauges[0]    :プレイヤーのウェイトゲージ
    // Scene_Map._waitGauges[index]:イベントIdのウェイトゲージ
    Scene_Map.prototype.updateWaitGauge = function(target, index){
	var gauge = this._waitGauges[index];

	if(gauge){
	    if(target.isWaitCanceled()){
		target.resetWaitCount();
		this.cancelWait(gauge);
		return ;
	    }
	    
	    if(target.getCurrentWaitCount() >= target.getWaitGaugeCount()){
		target.resetWaitCount();
		target._isWaitCompleted = true;
		this.completeWait(gauge);
		return ;
	    }	    
	}

	    if(target.getWaitGaugeCount() === 0 || target.getWaitGaugeCount() == null){
	        return ;
	    }	
	
	    // ゲージがない場合は作成
	    if(gauge == null){
	        gauge = this.createWaitGaugeWindow(index, 0, 0);
	    } else {
	        gauge.open();
	    }

	if(target.getCurrentWaitCount() === target.getWaitGaugeCount()){
	    gauge.close();
	} else {
	    this.updateWindowPosition(target, gauge);
	    
	    gauge.refresh(target.getWaitGaugeCount(), target.getCurrentWaitCount());
	}



    };

    // 対象の移動にあわせてウェイトゲージ追尾
    // 対象の右下が原点
    Scene_Map.prototype.updateWindowPosition = function(target, window){
	    var x = target.screenX();
	    var y = target.screenY();

	    if(windowPosition === POSITION_BOTTOM){
	        x -= $gameMap.tileWidth();
	        y += windowMargin;
	    }

	    if(windowPosition === POSITION_RIGHT){
	        x += windowMargin + windowPadding;
	        y -= ($gameMap.tileHeight() + window.height) / 2;
	    }
	
	    if(windowPosition === POSITION_LEFT){
	        x -= ($gameMap.tileWidth() + window.contentsWidth() + windowMargin);
	        y -= ($gameMap.tileHeight() + window.height) / 2;
	    }

	    if(windowPosition === POSITION_TOP){
	        x -= $gameMap.tileWidth();
	        y -= ($gameMap.tileHeight() + windowMargin + window.height);
	    }

	
	    if(window.isOpen()){
	        window.move(x, y, window.width, window.height);
	    }
    };
    
    
    // ウェイトキャンセル時
    Scene_Map.prototype.cancelWait = function(gauge){
	    if(gauge.isOpen()){
	        AudioManager.playSe({name: cancelSE, volume: 90, pitch: 100, pan: 0});
		if(cancelCommonEventId > 0){
		    $gameTemp.reserveCommonEvent(cancelCommonEventId);
		}
	        gauge.close();
	    }

    };
    
    // ウェイト完了時
    Scene_Map.prototype.completeWait = function(gauge){
	    if(gauge.isOpen()){
	        AudioManager.playSe({name: completeSE, volume: 90, pitch: 100, pan: 0});

		if(completeCommonEventId > 0){
		    $gameTemp.reserveCommonEvent(completeCommonEventId);
		}
		
	        gauge.close();
	    }
    };    
    // ---------Scene_Map(rpg_scenes.js)を上書き ここまで ------------------


    // ---------Game_Character(rpg_objects.js)を上書き ここから ------------------    
    // Game_Player,Game_Eventにウェイトゲージの値と設定を持たせる
    var _Game_Character_initMembers = Game_Character.prototype.initMembers;
    Game_Character.prototype.initMembers = function() {
	    _Game_Character_initMembers.call(this);

	    this._waitGaugeCount = 0;
	    this._currentWaitCount = 0;
	    this._movableWaiting = movableWaiting;
	    this._moveWaitCancel = moveWaitCancel;
	    this._isWaitCompleted = false;
	    this._isWaitCanceled = false;
    };

    var _Game_Character_update = Game_Character.prototype.update;
    Game_Character.prototype.update = function(){
	    if(this.hasWaitCount()){
	        this.addCount(1);
	    }
	    _Game_Character_update.call(this);	
    };

    Game_Character.prototype.setWaitCount = function(frameCount, currentWaitCount){
	    if(this.hasWaitCount() && reWaitMode === REWAIT_CANCEL){
	        this.cancelWait();
	        return ;
	    }

	    if(this.hasWaitCount() && reWaitMode == REWAIT_IGNORE){
	        return ;
	    }
	
	    this._waitGaugeCount = frameCount;
	    this._currentWaitCount = currentWaitCount;
	    this._isWaitCompleted = false;
	    this._isWaitCanceled = false;
    };


    Game_Character.prototype.resetWaitCount = function(){
	    // setWaitCount(0,0)だとウェイト中のウェイトがキャンセルの時に無限ループする
	    this._waitGaugeCount = 0;
	    this._currentWaitCount = 0;
    };    

    Game_Character.prototype.getWaitGaugeCount = function(){
	    return this._waitGaugeCount;
    };

    Game_Character.prototype.getCurrentWaitCount = function(){
	    return this._currentWaitCount;
    };

    Game_Character.prototype.addCount = function(val){	
	    this._currentWaitCount += val;
	    if(this._currentWaitCount < 0){
	        this._currentWaitCount = 0;
	    }
    };
    
    // ウェイトゲージ表示中に移動を許可するか設定
    Game_Character.prototype.setMovableWaiting = function(movable){
	    this._movableWaiting = movable;
    };

    // 移動キャンセルするか設定
    Game_Character.prototype.setMoveCancel = function(isCancel){
	    this._moveWaitCancel = isCancel;
    };

    // ウェイトが完了したか
    Game_Character.prototype.isWaitComplete = function(){
	    return this._isWaitCompleted;
    };

    // ウェイトがキャンセルされたか
    Game_Character.prototype.isWaitCanceled = function(){
	    return this._isWaitCanceled;
    };

    // ウェイト中か
    Game_Character.prototype.hasWaitCount = function(){
	    return this._waitGaugeCount > 0 && this._currentWaitCount <= this._waitGaugeCount;
    };

    // moveWaitCancelがtrueの時、移動時にキャンセルフラグを立てる
    var _Game_Character_moveStraight = Game_Character.prototype.moveStraight;
    Game_Character.prototype.moveStraight = function(d) {
	    _Game_Character_moveStraight.call(this, d);

	    if (this.isMovementSucceeded()) {	    
	        if(this.hasWaitCount() && this._moveWaitCancel){
		        this.cancelWait();
	        }
	    }
    };

    Game_Character.prototype.cancelWait = function(){
	    this._isWaitCanceled = true;
    };
    // ---------Game_Character(rpg_objects.js)を上書き ここまで ------------------    

    
    // ---------Game_Player(rpg_objects.js)を上書き ここから ------------------
    var _Game_Player_canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function() {
	    var movable = _Game_Player_canMove.call(this);
	    if(this.hasWaitCount()){
	        movable = this._movableWaiting;
	    }
	    return movable;
    };

    var _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function() {
	    _Game_Player_performTransfer.call(this);
	    if (transferWaitCancel){
	        $gamePlayer.cancelWait();
	    }
    };

    // ---------Game_Player(rpg_objects.js)を上書き ここまで ------------------

    
    // ---------Game_Event(rpg_objects.js)を上書き ここから ------------------
    // ウェイトゲージ表示中かつ移動禁止フラグがONの時はロックする
    var _Game_Event_update = Game_Event.prototype.update;
    Game_Event.prototype.update = function() {	
	    this._locked = this.hasWaitCount() && !this._movableWaiting;	
	    _Game_Event_update.call(this);
    };

    // 一時消去されていないイベントのみウェイトゲージを設定
    var _Game_Event_setWaitCount = Game_Event.prototype.setWaitCount;
    Game_Event.prototype.setWaitCount = function(frameCount, currentWaitCount){
	    if(!this._erased){
	        _Game_Event_setWaitCount.call(this, frameCount, currentWaitCount);
	    }
    };

    // イベントから接触された時にウェイトをキャンセル
    var _Game_Event_checkEventTriggerTouch = Game_Event.prototype.checkEventTriggerTouch;
    Game_Event.prototype.checkEventTriggerTouch = function(x, y) {
	    _Game_Event_checkEventTriggerTouch.call(this, x, y);

        if (this._trigger === 2 && $gamePlayer.pos(x, y)) {
            if (!this.isJumping() && this.isNormalPriority()) {
		        $gamePlayer.cancelWait();
            }
        }

    };
    
    // 一時消去時にウェイトをキャンセル
    var _Game_Event_erase = Game_Event.prototype.erase;
    Game_Event.prototype.erase = function() {
	    if(this.hasWaitCount()){
	        this.cancelWait();
	    }
	    _Game_Event_erase.call(this);
    };    
    // ---------Game_Event(rpg_objects.js)を上書き ここまで ------------------    
    
    // ---------ウェイトゲージウィンドウ ここから------------------------
    MT_WaitGauge.prototype = Object.create(Window_Base.prototype);
    MT_WaitGauge.prototype.constructor = MT_WaitGauge;
    
    MT_WaitGauge.prototype.initialize = function(x, y){
	    var width = this.windowWidth();
	    var height = this.windowHeight();
	    Window_Base.prototype.initialize.call(this, x, y, width, height);

	    this._waitCount = 0;
	    this._currentWaitCount = 0;
	    this.opacity = windowOpacity;
    };

    MT_WaitGauge.prototype.windowWidth = function(){
	    return gaugeWidth + (windowPadding * 2);
    };

    // ウィンドウテキストありの時は2行、なしの時は1行
    MT_WaitGauge.prototype.windowHeight = function(){
	    // windowPadding * 2だと端が切れる
	    var height = gaugeHeight + (windowPadding * 4);

	    if(windowText.length > 0){
	        height += this.lineHeight();
	    }

	    return height;
    };
    
    MT_WaitGauge.prototype.standardPadding = function() {
	    return windowPadding;
    };

    // ウェイトを設定し、ウェイトゲージを描画
    // Scene_Mapのupdateから呼ばれる
    MT_WaitGauge.prototype.refresh = function(frameCount, currentWaitCount){
	    this._waitCount = frameCount;
	    this._currentWaitCount = currentWaitCount;

	    this.createContents();
	    var waitValue = this._currentWaitCount + "/" + this._waitCount; // 未使用
	    var percentage = this._currentWaitCount / this._waitCount;

	    this.drawBar(percentage, gaugeColor1, gaugeColor2);
	    if(displayWaitValue){
	        this.drawPercentage(percentage);
	    }

	    this.drawWindowText();
    };    

    // ゲージ描画
    MT_WaitGauge.prototype.drawBar = function(rate, color1, color2) {
	    var x = windowPadding;
	    var y = windowPadding;
	    if(windowText.length > 0){
	        y += this.lineHeight();
	    }
	
	    var fillW = Math.floor(gaugeWidth * rate);
	    this.contents.fillRect(x, y, gaugeWidth, gaugeHeight, this.gaugeBackColor());
	    this.contents.gradientFillRect(x, y, fillW, gaugeHeight, color1, color2);
    };

    // 進捗(%)描画
    MT_WaitGauge.prototype.drawPercentage = function(percentage){
	    var y = 0;
	    if(windowText.length > 0){
	        y += this.lineHeight();
	    }
	
	    this.contents.fontSize = waitValueFontSize;
	    this.drawText(parseInt(percentage * 100) + "% ", 0, y, this.contentsWidth(), 'right');
	    this.resetFontSettings();
    };

    // ウィンドウ名
    MT_WaitGauge.prototype.drawWindowText = function(){
	    this.contents.fontSize = windowTextFontSize;
	    this.drawText(windowText, 0, 0, this.contentsWidth());
	    this.resetFontSettings();
    };
    // ---------ウェイトゲージウィンドウ ここまで ------------------------    
    

    // ---------- プラグインコマンドの定義 ここから ----------
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args){
        _Game_Interpreter_pluginCommand.call(this, command, args);
	    this.pluginCommandMT_WaitGauge(command, args);
    };

    Game_Interpreter.prototype.pluginCommandMT_WaitGauge = function(command, args){
        if(command === COMMAND_NAME){
            switch(args[0].toLowerCase()){
            case 'set':
		var targetId       = convertEscapeVariable(args[1]);
		var frameCount     = convertEscapeVariable(args[2]);

		var movable;
		if(args[3] != null){
		    movable = getParamBoolean(args[3]);
		}else{
		    movable = movableWaiting;
		}
		
		var moveCancel;
		if(args[4] != null){
		    moveCancel = getParamBoolean(args[4]);
		}else{
		    moveCancel = moveWaitCancel;
		}
		    
		var target         = null;
		if(targetId == 0 || targetId == "player"){
		    target = $gamePlayer;
		} else if(targetId >= 1){
		    target = $gameMap.event(targetId);
		}
		
		if(target){		    
		    target.setWaitCount(frameCount, 0);
		    target.setMovableWaiting(movable);
		    target.setMoveCancel(moveCancel);
		    
		}

                break;
		
            case 'cancel':
		        var targetId = convertEscapeVariable(args[1]);

		        if(targetId == "all"){
		            // プレイヤー
		            $gamePlayer.cancelWait();

		            // イベント
		            for(var i = 1; i < $gameMap.events().length + 1; i++ ){
			            $gameMap.event(i).cancelWait();
		            }		    
		        } else if(targetId == 0 || targetId == "player"){
		            $gamePlayer.cancelWait();
		        } else if(targetId >= 1){
		            $gameMap.event(targetId).cancelWait();
		        }
		

		
                break;
            }
        }
    };
    
    // ---------- プラグインコマンドの定義 ここまで ----------


    // ---------- パラメータ取得用関数ここから ----------
    function getParamNumber(param, defaultValue){
	    var result = Number(param || defaultValue);
	
	    if(Number.isNaN(result)){
	        result = defaultValue;
	    }

	    return result;
    };

    function getParamBoolean(param, defaultValue){
	    if(param){
	        return param.toLowerCase() === 'true';
	    }

	    if(!defaultValue){
	        defaultValue = false;
	    }
	
	    return defaultValue;
    }

    function getParamColorCode(codeName, defaultValue){
	    var pattern = /^#([\da-fA-F]{6}|[\da-fA-F]{3})$/;
	
	    // パターンに一致する時は配列、一致しない時はnull
	    if(!codeName.match(pattern)){
	        return defaultValue;
	    }
	    return codeName;
    }

    
    // \V[n]を変数の値に変換
    function convertEscapeVariable(text){
	    if(text == null){
	        return 0;
	    }

	    text = text.replace(/\\/g, '\x1b');
	    var result = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
	    }.bind(this));

	    // trueやfalseも数値扱いになるのに注意
	    if(isFinite(result)){
	        result = Number(result);
	    }

	    return result;
	
    }

    // ---------- パラメータ取得用関数ここまで ----------    
})();
