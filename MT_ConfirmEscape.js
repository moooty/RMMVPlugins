//=============================================================================
// MT_ConfirmEscape.js
// 逃げるコマンドに確認メッセージを表示するプラグイン
// ----------------------------------------------------------------------------
// (C) 2019 Moooty
//=============================================================================


/*:
 * @plugindesc Display confirm message for escape command.
 * @author Moooty
 *
 * @param message1
 * @desc Display message 1.
 * @type note
 * @default "Want to escape?\n(success rate：\\C[4]%\\C[0])"

 * @param rate1
 * @parent message1
 * @desc Display message1 when escape ratio under rate1.
 * @type number
 * @min 0
 * @max 100
 * @default 100
 *  
 * @param message2
 * @desc Display message 2.
 * @type note
 * @default "Want to escape?\n(success rate：\\C[17]%\\C[0])"
 * 
 * @param rate2
 * @parent message2
 * @desc Display message2 when escape ratio under rate2.
 * @type number
 * @min 0
 * @max 100
 * @default 60
 * 
 * @param message3
 * @desc Display message 3.
 * @type note
 * @default "Want to escape?\n(success rate：\\C[18]%\\C[0])"
 *
 * @param rate3
 * @parent message3
 * @desc Display message3 when escape ratio under rate3.
 * @type number
 * @min 0
 * @max 100
 * @default 30
 *
 * @param commandYesLabel
 * @desc Text confirm command 'yes'.
 * @type string
 * @default Yes
 *
 * @param commandNoLabel
 * @desc Text confirm command 'no'.
 * @type string
 * @default No
 * 
 * @param commandDefaultIndex
 * @desc Default button in confirm command.
 * @type select
 * @default 0
 * 
 * @option command Yes
 * @value 0
 *
 * @option command No
 * @value 1
 *
 * @param commandPosition
 * @desc Display position confirm command.
 * @type select
 * @default 2
 * 
 * @option Left
 * @value 0
 *
 * @option Middle
 * @value 1
 *
 * @option Center
 * @value 2
 *
 * @help
 * === Description ===
 * Display confirm message for escape command.
 * 
 * Nothing plugin commnad this plugin.
 * 
 * 
 * === Change Log ===
 * Apr  7, 2019 ver1.00 initial release
 * Apr 22, 2019 ver1.01 bag fix(when party command is hide, freeze on cancel)
 * Nov 24, 2019 ver1.10 rename plugin file.(ConfirmEscape.js→MT_ConfirmEscape.js)
 * 
 * === Manual & License(Japanese) ===
 * https://www.5ing-myway.com/rpgmaker-plugin-confirm-escape/
 * 
 */

/*:ja
 * @plugindesc 逃げるコマンドに確認メッセージを表示するプラグイン
 * @author むーてぃ
 *
 * @param message1
 * @text メッセージ1
 * @desc 確認メッセージ1
 * @type note
 * @default "本当に逃げますか？\n(成功確率：\\C[4]%\\C[0])"
 *
 * @param rate1
 * @parent message1
 * @text 割合
 * @desc 逃走確率がこの値以下の時にメッセージ1が表示されます
 * @type number
 * @min 0
 * @max 100
 * @default 100
 *  
 * @param message2
 * @text メッセージ2
 * @desc 確認メッセージ2
 * @type note
 * @default "本当に逃げますか？\n(成功確率：\\C[17]%\\C[0])"
 * 
 * @param rate2
 * @parent message2
 * @text 割合
 * @desc 逃走確率がこの値以下の時にメッセージ2が表示されます
 * @type number
 * @min 0
 * @max 100
 * @default 60
 * 
 * @param message3
 * @text メッセージ3
 * @desc 確認メッセージ3
 * @type note
 * @default "本当に逃げますか？\n(成功確率：\\C[18]%\\C[0])"
 *
 * @param rate3
 * @parent message3
 * @text 割合
 * @desc 逃走確率がこの値以下の時にメッセージ3が表示されます
 * @type number
 * @min 0
 * @max 100
 * @default 30
 *
 * @param commandYesLabel
 * @text 「はい」ボタンの名前
 * @desc 逃げるを実行するボタン名
 * @type string
 * @default はい

 * @param commandNoLabel
 * @text 「いいえ」ボタンの名前
 * @desc 逃げるをキャンセルするボタン名
 * @type string
 * @default いいえ
 * 
 * @param commandDefaultIndex
 * @text デフォルトボタン
 * @desc デフォルトボタン
 * @type select
 * @default 0
 * 
 * @option 「はい」ボタン
 * @value 0
 *
 * @option 「いいえ」ボタン
 * @value 1

 * @param commandPosition
 * @text 選択肢の表示位置
 * @desc 選択肢の表示位置
 * @type select
 * @default 2
 * 
 * @option 左
 * @value 0
 *
 * @option 中
 * @value 1
 *
 * @option 右
 * @value 2
 *
 * @help
 * === 説明 ===
 * 逃げるコマンドを選択した時に確認メッセージを表示するプラグインです。
 * 
 * このプラグインにはプラグインコマンドはありません。
 * 
 * === 更新履歴 ===
 * 2019/04/07 ver1.00 初版
 * 2019/04/22 ver1.01 パーティコマンドを非表示の時にキャンセルするとフリーズする不具合を修正。
 * 2019/11/24 ver1.10 ファイル名を変更(ConfirmEscape.js → MT_ConfirmEscape.js)
 *
 * === マニュアル＆ライセンス ===
 * https://www.5ing-myway.com/rpgmaker-plugin-confirm-escape/
 * 
 */


var Imported = Imported || {};
Imported.MT_ConfirmEscape = true;

(function(){
    'use strict';

    // 定数の定義
    const PLUGIN_NAME = "MT_ConfirmEscape";
    
    // ---------- 基本システムの変更 ここから ----------
    // <rpg_managers.js>
    // BattleManagerに逃走確率を取得するメソッドを追加
    BattleManager.getEscapeRatio = function() {
	    return this._escapeRatio;
    };

    
    // <rpg_scenes.js>
    var _Scene_Battle_initialize = Scene_Battle.prototype.initialize;
    Scene_Battle.prototype.initialize = function() {
	    _Scene_Battle_initialize.call(this);
	    this._isSelectEscape = null;
	    this._confirmEscape = new ConfirmEscape();
    };    

    // 逃げるコマンドをオーバーライド
    var _Scene_Battle_commandEscape = Scene_Battle.prototype.commandEscape;
    Scene_Battle.prototype.commandEscape = function() {	
	    this._confirmEscape.setText();
	    this._confirmEscape.setChoices();
	    this._confirmEscape.setCallback(function(isEscape) {
	        this._isSelectEscape = isEscape;

		if(!this._isSelectEscepe){
		    this.changeInputWindow();
		}
		
	        // これを入れないとBattleManager.updateが呼ばれずにフリーズする
		this._partyCommandWindow.deactivate();
		this._actorCommandWindow.deactivate();// 個人コマンドから呼びだした時用
	    
	        // ここで元のcommandEscapeを呼びだすと
	        // 逃走結果メッセージが表示されないのでupdateで判定する
	    }.bind(this));
    };

    // updateに逃げた時の判定処理を追加
    var _Scene_Battle_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
	    if(this._isSelectEscape != null){
	        if(this._isSelectEscape){
		    _Scene_Battle_commandEscape.call(this);		    
	        }
            
	        this._isSelectEscape = null;
	     }

	    _Scene_Battle_update.call(this);
    };
    // ----------基本システムの変更 ここまで ----------


    // ----------ConfirmEscape ここから ----------
    // プラグインパラメータを受け取る
    var parameters = PluginManager.parameters(PLUGIN_NAME);    
    
    function ConfirmEscape(){
	    this.initialize.call(this, arguments);
    };

    ConfirmEscape.prototype.initialize = function(){
	    this._isEscape = null;
	    this._callback = null;
    };
    
    ConfirmEscape.prototype.setCallback = function(callback){
	    this._callback = callback;
    };

    // 逃走メッセージ取得
    ConfirmEscape.prototype.setText = function(){
	    var ratio = parseInt(BattleManager.getEscapeRatio() * 100);
	    if(ratio > 100){
	        ratio = 100;
	    }
        
	    var message = this.getMessageByRate(ratio);
	    
	    ratio = ratio + '%';
	    message = message.replace('%', ratio);	
	    
	    $gameMessage.add(message);
    };

    // 逃走確率によってメッセージを変える
    ConfirmEscape.prototype.getMessageByRate = function(ratio){
	    var messages = [];
	    var rates = [];
	    
	    for(var i = 1; i < 4; i++ ){
	        messages.push(JsonEx.parse(parameters['message' + i]));
	        rates.push(getParameterValue(parameters['rate' + i], 0));
	    }

	    var result;
	    for(var ri = rates.length - 1; ri >= 0; ri--){
	        var threshold = rates[ri];
	        if(ratio <= threshold){
		        if(messages[ri] !== ''){
		            result = messages[ri];
		            break;
		        }		
	        }
	    }

	    if(result === ''){
	        result = messages[0];
	    }
	
	    return result;
    };

    // 選択肢を設定
    ConfirmEscape.prototype.setChoices = function() {
	    const BACKGROUND_WINDOW = 0;
		const POSITION_RIGHT    = 2;
	    const COMMAND_NO        = 1;
	
	    var commandYesLabel = parameters['commandYesLabel'];
	    var commandNoLabel  = parameters['commandNoLabel'];
	    var commandDefault  = getParameterValue(parameters['commandDefaultIndex'], 0);
	    var commandPosition = getParameterValue(parameters['commandPosition'], POSITION_RIGHT);
	
	    var choices         = [commandYesLabel, commandNoLabel];
	    var cancelType      = COMMAND_NO;
	    
	    $gameMessage.setChoices(choices, commandDefault, cancelType);
	    $gameMessage.setChoiceBackground(BACKGROUND_WINDOW);
	    $gameMessage.setChoicePositionType(commandPosition);
	    $gameMessage.setChoiceCallback(function(n) {
	        if(this._callback != null){
		        this._callback(this.selectEscapeYes(n));
		        this._callback = null;
	        }
	    }.bind(this));	
    };

    ConfirmEscape.prototype.selectEscapeYes = function(index){
	    if(index === 0){
	        return true;
	    }
	    return false;
    };    
    // ----------ConfirmEscape ここまで ----------

    // ---------- パラメータ取得用関数ここから ----------
    // @type numberのパラメータでも文字列を入れることができてしまう対策
    function getParameterValue(param, defaultValue){
	    var result = Number(param || defaultValue);
	
	    if(Number.isNaN(result)){
	        result = defaultValue;
	    }

	    return result;
    };        
})();
