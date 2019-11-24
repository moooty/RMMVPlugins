//=============================================================================
// MT_BattleLogFilter.js
// 戦闘ログの不要な文章をフィルターしてバトルを高速化する
// ----------------------------------------------------------------------------
// (C) 2019 Moooty
//=============================================================================

/*:ja
 * @plugindesc 戦闘ログをフィルターする
 * @author むーてぃ
 *
 * @help
 * 戦闘ログの不要な文章をフィルターしてバトルを高速化する
 */

var Imported = Imported || {};
Imported.MT_BattleLogFilter = true;

(function(){
    'use strict';
    
    Window_BattleLog.prototype.displayHpDamage = function(target) {
	if (target.result().hpAffected) {
            if (target.result().hpDamage > 0 && !target.result().drain) {
		this.push('performDamage', target);
            }
            if (target.result().hpDamage < 0) {
		this.push('performRecovery', target);
            }

	    // ダメージをログウィンドウに表示しない(ポップアップのみ)
            // this.push('addText', this.makeHpDamageText(target));
	}
    };
}());
