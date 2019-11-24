//=============================================================================
// MT_EnemySelectCursorLoop.js
// 敵選択画面でカーソルを左右にループさせるプラグイン
// ----------------------------------------------------------------------------
// (C) 2019 Moooty
//=============================================================================

/*:ja
 * @plugindesc 敵選択画面でカーソルを左右にループさせるプラグイン
 * @author むーてぃ
 *
 * @help
 * 敵選択ウィンドウでカーソルを左右にループできるようにします。
 * 敵A,B,Cが並んでいたらC→A、A→Cへループできるようになります。
 *
 * メモ：
 * FTKR_CustomSimpleActorStatus.jsが
 * Window_Selectableのcursor○○メソッドをオーバーライドしているので注意
 */

var Imported = Imported || {};
Imported.MT_EnemySelectCursorLoop = true;

(function(){
    'use strict';
	
    Window_BattleEnemy.prototype.cursorRight = function(wrap) {
		var index = this.index();
		var maxItems = this.maxItems();
		var maxCols = this.maxCols();
		if(Imported.FTKR_CSS){
			maxCols = this.customMaxCols();
		}
		
		
		if (maxCols >= 2 && (index <= maxItems - 1 || (wrap && this.isHorizontal()))) {
				this.select((index + 1) % maxItems);
		}
    };

    Window_BattleEnemy.prototype.cursorLeft = function(wrap) {
		var index = this.index();
		var maxItems = this.maxItems();
		var maxCols = this.maxCols();
		
		if(Imported.FTKR_CSS){
			maxCols = this.customMaxCols();
		}	    

		if (maxCols >= 2 && (index => 0 || (wrap && this.isHorizontal()))) {
				this.select((index - 1 + maxItems) % maxItems);
		}
    };
})();


