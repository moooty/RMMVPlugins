//=============================================================================
// MT_SwitchFollowerUpdate.js
// プラグインコマンドから仲間(フォロワー)の追従のオン・オフを切りかえる
// ----------------------------------------------------------------------------
// (C) 2019 Moooty
//=============================================================================

/*:ja
 * @plugindesc プラグインコマンドから仲間(フォロワー)の追従のオン・オフを切りかえる
 * @author むーてぃ
 *
 * @help
 * 
 */

var Imported = Imported || {};
Imported.MT_SwitchFollowerUpdate = true;

(function(){
    'use strict';

    const PLUGIN_NAME = 'MT_SwitchFollowerUpdate';
    var flg = true;
    
    // ---------- プラグインコマンドの定義 ここから ----------
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args){
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if(command === PLUGIN_NAME){
            switch(args[0]){
            case 'on':
                setFlug(true);
                break;
            case 'off':
                setFlug(false);
                break;
            }
        }
    };    
    // ---------- プラグインコマンドの定義 ここまで ----------

	var _Game_Followers_updateMove = Game_Followers.prototype.updateMove;
    Game_Followers.prototype.updateMove = function() {	
		if(flg === true){
			_Game_Followers_updateMove.call(this);
		}
    };

    function setFlug(newFlug){
		flg = newFlug;
    }
})();
