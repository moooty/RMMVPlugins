//=============================================================================
// MT_SingleSaveData.js
// セーブデータを1つにするプラグイン
// ----------------------------------------------------------------------------
// (C) 2019 Moooty
//=============================================================================

/*:ja
 * @plugindesc セーブデータを1つにするプラグイン
 * @author むーてぃ
 *
 * @help
 * タイトル画面のニューゲームをニューゲーム・ロード兼用にします（スマホゲーム向け）
 * ゲーム内でのセーブはTorigoya_SaveCommand.jsなどを使用して使う。
 */ 

var Imported = Imported || {};
Imported.MT_SingleSaveData = true;

(function(){
    'use strict';
    
    // ニューゲームコマンドの処理を変更:
    // セーブデータがある場合: ロード
    // セーブデータがない場合: ニューゲーム
    var _Scene_Title_commandNewGame = Scene_Title.prototype.commandNewGame;
    Scene_Title.prototype.commandNewGame = function() {
		if(!DataManager.isAnySavefileExists()){
			_Scene_Title_commandNewGame.call(this);
		}else {
			this.commandContinue();
		}
    };

    // コンティニューコマンドの処理を変更:
    // ロード画面をはさまずにロードするようにする
    Scene_Title.prototype.commandContinue = function() {
		this._commandWindow.close();
		// SceneManager.push(Scene_Load);
	
		var savefileId = DataManager.lastAccessedSavefileId() - 1;
		if (DataManager.loadGame(savefileId)) {
			SoundManager.playLoad();
			this.fadeOutAll();
			Scene_Load.prototype.reloadMapIfUpdated.call(this);
			SceneManager.goto(Scene_Map);
			$gameSystem.onAfterLoad();
		}else {
			SoundManager.playBuzzer();
		}
    };    

    // タイトル画面からコンティニューコマンドを消す
    Window_TitleCommand.prototype.makeCommandList = function() {
		this.addCommand(TextManager.newGame,   'newGame');
		// this.addCommand(TextManager.continue_, 'continue', this.isContinueEnabled());
		this.addCommand(TextManager.options,   'options');
    };   
})();
