//=============================================================================
// MT_TitlePictures.js
// タイトル画面にピクチャを重ねて表示する
//=============================================================================
/*:
 * @plugindesc Show pictures on title screen.
 * @author Moooty
 *
 * @param pictures
 * @desc pictures list(You need put picture in img/pictures folder).
 * @type struct<TitlePicture>[]
 *
 * @help
 * === Description ===
 * Show pictures on title screen.
 * 
 * Nothing plugin command this plugin.
 * 
 * 
 * === Change Log ===
 * June 5, 2019 ver1.00 Initial release.
 * 
 * 
 * === Manual & License(Japanese) ===
 * https://www.5ing-myway.com/rpgmaker-plugin-mt_titlepictures/
 *
 */

/*:ja
 * @plugindesc タイトル画面にピクチャを重ねて表示する
 * @author むーてぃ
 *
 * @param pictures
 * @text ピクチャ
 * @desc タイトル画面に表示させる画像のリスト(pictureフォルダに置いてください)
 * @type struct<TitlePicture>[]
 *
 * @help
 * === 説明 ===
 * タイトル画面にピクチャを表示するプラグインです。
 * プラグインパラメータのピクチャリストの下にあるものほど手前に表示されます。
 *
 * このプラグインにはプラグインコマンドはありません。
 * 

 * === 更新履歴 ===
 * 2019/6/5 ver1.00 初版
 *
 * === マニュアル＆ライセンス ===
 * https://www.5ing-myway.com/rpgmaker-plugin-mt_titlepictures/
 * 
 */

/*~struct~TitlePicture:
 * @param fileName
 * @text ファイル名
 * @desc 表示する画像
 * @type file
 * @dir img/pictures
 * @require 1
 * 
 * @param switch
 * @text スイッチ
 * @desc ピクチャを表示させるスイッチを選択してください。(オンの時にピクチャ表示)
 * @type switch
 * 
 * @param firstBoot
 * @text 初回起動時
 * @desc 初回起動時(セーブデータがない時)にピクチャを表示するか
 * @type boolean
 * @default true
 * 
*/

var Imported = Imported || {};
Imported.MT_TitlePictures = true;

(function(){
    'use strict';
	
    var PLUGIN_NAME  = 'MT_TitlePictures';
    var PARAM_NAME 　　= 'titlePicturesVisible';
    var params 　　　　　　= PluginManager.parameters(PLUGIN_NAME)['pictures'];
    params 　　　　　　　　　　= toObject(params);    

    // Scene_Title(rpg_scenes.js)をオーバーライドして処理を呼びだし
    var _Scene_Title_createForeground = Scene_Title.prototype.createForeground;
	Scene_Title.prototype.createForeground = function() {
		this.showPictures();
		_Scene_Title_createForeground.call(this);        
    };

    //ピクチャ表示処理
    Scene_Title.prototype.showPictures = function() {
		var globalData = DataManager.loadGlobalInfo();		
		var latestSaveId = DataManager.latestSavefileId();
		var latestFile = globalData[latestSaveId];

		// 初回起動判定
		var firstBoot = true;
		if(latestFile != null){
			if(latestFile.hasOwnProperty(PARAM_NAME)){	    
				firstBoot = false;
			};
		}	

		// ピクチャ表示
		for (var i = 0; i < params.length;i++ ){
			var picture = params[i];

			var visible;
			if(firstBoot){
				visible = picture['firstBoot'];
			}else{
				visible = latestFile[PARAM_NAME][i];
			}

			if(visible){
				var titleSprite = new Sprite(ImageManager.loadPicture(picture['fileName']));
				this.addChild(titleSprite);
			}	   
		}	
    };


    // セーブ時にスイッチの値を保存
    // DataManageer(rpg_managers.js)をオーバーライド
    var _DataManager_makeSavefileInfo = DataManager.makeSavefileInfo;
    DataManager.makeSavefileInfo      = function() {
		var info = _DataManager_makeSavefileInfo.apply(this, arguments);
		this.saveTitlePicturesVisible(info);
		return info;
    };

    DataManager.saveTitlePicturesVisible = function(info) {
		info[PARAM_NAME] = [];
		for(var i = 0; i < params.length; i++ ){
			info[PARAM_NAME].push($gameSwitches.value(params[i]['switch']));
		}
    };

    // プラグインパラメータをオブジェクトに変換
    function toObject(params){
		params = JSON.parse(params).map(function(data){
			var obj = JSON.parse(data);
			obj['firstBoot'] = (obj['firstBoot'].toLowerCase() === "true");
			return obj;
		});

		return params;
    }
})();
