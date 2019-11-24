//=============================================================================
// MT_TextManagerEx.js
// 用語(テキストマネージャ)拡張
// ----------------------------------------------------------------------------
// (C) 2019 Moooty
//=============================================================================

/*:ja
 * @plugindesc 用語(テキストマネージャ)拡張
 * @author むーてぃ
 * 
 * @help
 * TextManagerに命中率などXParam名を追加
 */
 
 var Imported = Imported || {};
Imported.MT_TextManagerEx = true;

(function(){
    'use strict';
	
    var xparamText = ["命中率","回避率", "クリティカル率"];

    TextManager.xParam = function(paramId) {
		return xparamText[paramId] || '';
    };
})();
