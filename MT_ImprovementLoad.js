/*:ja
 * @plugindesc 処理を軽くするプラグイン(ベータ版)
 * @author むーてぃ
 *
 * @param updateNearEvents
 * @text 近くのイベントのみ更新
 * @desc プレイヤーの近くのイベントのみ更新します。
 * @type boolean
 * @default true
 * 
 * @param rangeNearPlayer
 * @text 近くのマスの範囲
 * @desc 近くの範囲をのタイル数を調整します。(デフォルト:20)
 * @type number
 * @default 20
 * 
 * @param updateChangedParallax
 * @text 遠景の更新を抑制する
 * @desc 遠景未使用のマップで遠景スプライトを生成しなくなります。(※)
 * @type boolean
 * @default false
 * 
 *
 * @help
 * === 説明 ===
 * おもにマップ画面(移動画面)の負荷を軽くします。
 * 
 * ・イベント画像が「なし」かつ「向き固定」のイベントについて
 *   スプライトの生成を行わなくなります。
 *   これにより、スプライト更新の負荷を軽減します。
 *   
 * ・移動しないオブジェクト(移動タイプが「固定」で、
 *   イベント画像が「なし」か足踏みアニメが「なし」のもの)の
 *   移動の更新処理をスキップします。
 *
 * ■プラグインパラメータ補足
 * ※遠景の更新を抑制する
 * エディタ上で遠景未設定のマップで「遠景の変更」コマンドを使用した場合、
 * エラーが発生します。
 * (エディタで遠景が設定されているマップはエラーになりません)
 * 
 * 遠景の変更コマンドを使用するマップで最初は遠景を非表示にしたい場合は、
 * 透明のダミー遠景を設定してください。
 *
 * === 更新履歴 ===
 * 2019/11/23  ver0.10 ベータ版
 *
 * === マニュアル＆ライセンス ===
 * https://www.5ing-myway.com/rpgmaker-plugin-waitgauge/
 */


// 参考にしたページ
// https://note.mu/aebafuti/n/n0ec8e9e02a7b
// https://ktakaki.hatenablog.com/entry/20120101/p3
// http://www.rpgmaker-script-wiki.xyz/getEventInformation_mv.php

var Imported = Imported || {};
Imported.MT_ImprovementLoad = true;

(function(){
    'use strict';
    
    const PLUGIN_NAME = "MT_ImprovementLoad";
    
    var parameters            = PluginManager.parameters(PLUGIN_NAME);
    var updateNearEvents      = getParamBoolean(parameters['updateNearEvents']      , false);
    var rangeNearPlayer       = getParamNumber(parameters['rangeNearPlayer']        , 20);
    var selfRefresh           = getParamBoolean(parameters['selfRefresh']           , true);
    var updateChangedParallax = getParamBoolean(parameters['updateChangedParallax'] , false);
    
    // ************************************************
    // イベントのupdate処理の負荷軽減
    // ************************************************
    // 更新するイベントをプレイヤー周辺のみにする
    // →通常15FPSくらいになった。ただしプレイヤー探索プラグインで視界に入ると7FPSになる。
    var _Game_Map_updateEvents = Game_Map.prototype.updateEvents;
    Game_Map.prototype.updateEvents = function() {
	if(updateNearEvents){
	    this.events().forEach(function(event) {
		if(event.isNearThePlayer()){
		    event.update();
		}
	    });
	    
	    this._commonEvents.forEach(function(event) {
		event.update();
	    });	    
	} else {
	    _Game_Map_updateEvents.call(this);
	}
    };

    Game_Event.prototype.isNearThePlayer = function() {
	var sx = Math.abs(this.deltaXFrom($gamePlayer.x));
	var sy = Math.abs(this.deltaYFrom($gamePlayer.y));
	return sx + sy < rangeNearPlayer;
    };    
    // ↑以外の効果はあまりないので↑だけでもいいかも
    
    // ↓競合するなら切ってもいい    
    // 固定イベントは移動更新処理を呼ばない
    Game_Event.prototype.update = function() {
	if(!this.isStaticEvent()){
	    Game_Character.prototype.update.call(this);
	}
	
	this.checkEventTriggerAuto();
	this.updateParallel();
    };

    // 固定イベントの条件:
    // 移動ルートが固定・移動ルートで移動中じゃない・足踏みアニメがない or 画像が透明
    Game_Event.prototype.isStaticEvent = function(){
	return this._moveType === 0 && !this.isMoveRouteForcing() && (this.characterName() === "" || !this.hasStepAnime());
    };
        
    // **************************************************
    // マップのrefresh処理の負荷軽減
    // **************************************************
    // セルフスイッチ変更時、自身のイベントだけrefreshする
    Game_SelfSwitches.prototype.setValue = function(key, value) {
	if (value) {
	    this._data[key] = true;
	} else {
	    delete this._data[key];
	}
	var eventId = key[1];
	this.onChange(eventId);
    };

    var _Game_SelfSwitches_onChange = Game_SelfSwitches.prototype.onChange;
    Game_SelfSwitches.prototype.onChange = function(eventId) {
	if(selfRefresh){
	    if($gameMap.event(eventId)){
		$gameMap.event(eventId).refresh();
	    } 
	} else {
	    _Game_SelfSwitches_onChange.call(this);
	}

    };

    // ************************************************
    // スプライト処理の負荷軽減
    // ************************************************
    // Sprite.updateで呼びだされる
    // 画面より大きいサイズで塗りつぶすのをやめる
    // 画面を縮小して表示した時、変更が画面全体にならないので注意。
    // RGB値のいずれかが変更になった時だけ実行されるのであまり効果ないかも。
    // マップ読み込み時に6回呼ばれる
    // 画面の色調変更では呼ばれない
    // 画面のフラッシュで前回とは違う色で呼びだした時に呼ばれる
    // 画面サイズジャストだと$gameScreen.setZoomで縮小した時にずれる
    // 影響範囲はzoomが1未満(縮小)かつフラッシュの時なので運用回避してもいいかも    
    // サイズは↓でいけるけど座標の調整がうまくいかない
    // var zoomWidth = Graphics.width / $gameScreen.zoomScale();
    // var zoomHeight = Graphics.height / $gameScreen.zoomScale();
    ScreenSprite.prototype.setColor = function (r, g, b) {
	if (this._red !== r || this._green !== g || this._blue !== b) {
            r = Math.round(r || 0).clamp(0, 255);
            g = Math.round(g || 0).clamp(0, 255);
            b = Math.round(b || 0).clamp(0, 255);
            this._red = r;
            this._green = g;
            this._blue = b;
            this._colorText = Utils.rgbToCssColor(r, g, b);

            var graphics = this._graphics;
            graphics.clear();
            var intColor = (r << 16) | (g << 8) | b;
            graphics.beginFill(intColor, 1);
            //whole screen with zoom. BWAHAHAHAHA
	    if($gameScreen.zoomScale() >= 1){
		graphics.drawRect(0, 0, Graphics.width, Graphics.height);
	    }else{
		// 要修正: あとでいい方法を考える
		graphics.drawRect(-Graphics.width * 5, -Graphics.height * 5, Graphics.width * 10, Graphics.height * 10);
	    }	   
	}
    };

   
    Spriteset_Map.prototype.createLowerLayer = function() {
	Spriteset_Base.prototype.createLowerLayer.call(this);
	// 遠景をエディタで設定していないマップで遠景の変更をした場合エラーになる
	// →遠景の変更を使うマップには透明のダミー遠景用意しておいて運用回避(とりあえず)
	if($gameMap.parallaxName() !== ""){
	    this.createParallax();
	}
	
	this.createTilemap();
	this.createCharacters();
	
	this.createShadow();
	
	this.createDestination();	
	this.createWeather();
    };

    // 遠景が設定されている時だけ更新
    var _Spriteset_Map_updateParallax = Spriteset_Map.prototype.updateParallax;
    Spriteset_Map.prototype.updateParallax = function() {
	if(this._parallax != null){
	    _Spriteset_Map_updateParallax.call(this);
	}
    };


    // 不要なSpriteを生成しないようにして負荷を軽減する
    Spriteset_Map.prototype.createCharacters = function() {
	this._characterSprites = [];
	// 透明かつ向き固定のイベントに関してはSpriteの生成を行わない
	$gameMap.events().forEach(function(event) {
	    if(event.characterName() !== "" || !event.isDirectionFixed()){
		this._characterSprites.push(new Sprite_Character(event));
 	    }	    
	}, this);


	$gameMap.vehicles().forEach(function(vehicle) {
            this._characterSprites.push(new Sprite_Character(vehicle));
	}, this);
	
	$gamePlayer.followers().reverseEach(function(follower) {
            this._characterSprites.push(new Sprite_Character(follower));
	}, this);
	
	this._characterSprites.push(new Sprite_Character($gamePlayer));
	for (var i = 0; i < this._characterSprites.length; i++) {
            this._tilemap.addChild(this._characterSprites[i]);
	}
    };

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
    // ---------- パラメータ取得用関数ここまで ----------    
})();
