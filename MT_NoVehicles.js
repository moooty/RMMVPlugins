//=============================================================================
// MT_NoVehicles.js
// 乗り物使わないプラグイン
// 乗り物に関する処理をなくすことで処理の負荷を軽くする
// ----------------------------------------------------------------------------
// (C) 2019 Moooty
//=============================================================================

/*:ja
 * @plugindesc 乗り物使わないプラグイン
 * @author むーてぃ
 *
 * @help
 * 乗り物に関する処理をなくすことで処理の負荷を軽くします。
 */

var Imported = Imported || {};
Imported.MT_NoVehicles = true;

(function(){
    'use strict';

    Game_Map.prototype.createVehicles = function() {
		// Do nothing.
    };

    Game_CharacterBase.prototype.isCollidedWithVehicles = function(x, y) {
		return false;
    };
    
    Game_Player.prototype.getOnOffVehicle = function() {

    };
    
    Game_Player.prototype.triggerTouchActionD1 = function(x1, y1) {
		this.checkEventTriggerHere([0]);
		return $gameMap.setupStartingEvent();
    };
    
    Game_Player.prototype.triggerTouchActionD2 = function(x2, y2) {
		this.checkEventTriggerThere([0,1,2]);
		return $gameMap.setupStartingEvent();
    };

    // 飛行船の影の更新処理：
    // 本当はSpriteset_Map.updateでupdateShodowを呼びださないようにしたいけどSprite系プラグインと競合しそう
    Spriteset_Map.prototype.updateShadow = function() {
	
    };
})();

