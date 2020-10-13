/**
 * Created by onlyfu on 2019/03/05.
 */
App.module.extend('background', function() {
    //
    let self = this;

    this._init = function() {
        // 打开主界面
        chrome.browserAction.onClicked.addListener(function (tab) {
            chrome.tabs.create({url: chrome.extension.getURL("index.html")});
        });
        //
        chrome.contextMenus.create({
            type: 'normal',
            title: 'XZ - Upload the image',
            contexts: ['image'],
            id: 'XZ_UPLOADOR',
            onclick: function(info, tab) {
                console.log(info);
                self.module.images.ajaxUpload(info.srcUrl, function(response) {
                    console.log(response);
                });
            }
        }, function () {
            self.log('created context menus.');
        });
        //
        chrome.contextMenus.create({
            type: 'normal',
            title: 'XZ - Collections',
            contexts: ['selection'],
            id: 'XZ_COLLECTIONS',
            onclick: function(info, tab) {
                console.log(info);
            }
        }, function () {
            self.log('created context menus.');
        });
    };
});
