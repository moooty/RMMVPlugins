//=============================================================================
// MT_NoFollowers.js
// 隊列(フォロワー・仲間)使わないプラグイン
// フォロワーに関する処理をなくすことで処理の負荷を軽くする
// ----------------------------------------------------------------------------
// (C) 2019 Moooty
//=============================================================================

/*:ja
 * @plugindesc 隊列(フォロワー・仲間)使わないプラグイン
 * @author むーてぃ
 *
 * @help
 * フォロワーに関する処理をなくすことで処理の負荷を軽くします。
 */
 
var Imported = Imported || {};
Imported.MT_NoFollowers = true;

(function(){
    'use strict';

    Game_Followers.prototype.initialize = function() {
		this._visible = false;
		this._gathering = false;
		this._data = [];
    };
})();
