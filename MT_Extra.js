//=============================================================================
// MT_Extra.js
// エクストラ(おまけ)モードをマップで実装するためのプラグイン
// ----------------------------------------------------------------------------
// (C) 2019 Moooty
//=============================================================================
//
/*:ja
 * @plugindesc エクストラ(おまけ)モードをマップで実装するためのプラグイン
 * @author むーてぃ
 * 
 * @param commandName
 * @text コマンド名
 * @desc タイトル画面で表示するコマンド名
 * @default おまけ
 * 
 * @param extraMapId
 * @text エクストラモードのマップID
 * @desc コマンドを選択した時に移動するマップID
 * @default 0

 * @help
 * 
 */
 
var Imported = Imported || {};
Imported.MT_Extra = true;

(function(){
    'use strict';

    const PLUGIN_NAME = 'MT_Extra';
    var parameters    = PluginManager.parameters(PLUGIN_NAME);

    var commandName   = parameters['commandName'];
    var extraMapId    = getParameterValue(parameters['extraMapId'], 0);
    
    DataManager.setupExtra = function() {
		this.createGameObjects();	
		// $gameParty.setupStartingMembers();
		$gamePlayer.setTransparent(true);
		$gamePlayer.reserveTransfer(extraMapId, 0, 0);
		Graphics.frameCount = 0;
    };
    
    var _Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
		_Scene_Title_createCommandWindow.call(this);
		this._commandWindow.setHandler('extra', this.commandExtra.bind(this));
    };


    Scene_Title.prototype.commandExtra = function(){
		DataManager.setupExtra();
		this._commandWindow.close();
		this.fadeOutAll();
		SceneManager.goto(Scene_Map);
    };

    var _Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function() {
		_Window_TitleCommand_makeCommandList.call(this);
		this.addCommand(commandName, 'extra');
    };


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
