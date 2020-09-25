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
    };
});
