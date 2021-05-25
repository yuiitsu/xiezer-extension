/**
 * Created by onlyfu on 2019/03/05.
 */
App.module.extend('background', function() {
    //
    let self = this,
        openerTabId = 0;

    this._init = function() {
        // 打开主界面，一次只能打开一个TAB
        chrome.browserAction.onClicked.addListener(function (tab) {
            if (openerTabId > 0) {
                chrome.tabs.get(openerTabId, function(t) {
                    if (t) {
                        chrome.windows.update(t.windowId, {focused: true});
                        chrome.tabs.update(openerTabId, {active: true});
                    } else {
                        chrome.tabs.create({
                            url: chrome.extension.getURL("index.html")
                        }, function(tab) {
                            openerTabId = tab.id;
                        })
                    }
                });
            } else {
                chrome.tabs.create({
                    url: chrome.extension.getURL("index.html")
                }, function (t) {
                    openerTabId = t.id;
                });
            }
        });
        //
        chrome.contextMenus.create({
            type: 'normal',
            title: 'Upload Image',
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
            title: 'Collections',
            contexts: ['selection'],
            id: 'XZ_COLLECTIONS',
            onclick: function(info, tab) {
                console.log(info);
            }
        }, function () {
            self.log('created context menus.');
        });
        //
        chrome.contextMenus.create({
            type: 'normal',
            title: 'Translation Mode',
            contexts: ['page'],
            id: 'XZ_TRANSLATION_MODE',
            onclick: self.openReaderMode
        }, function () {
            self.log('created context menus.');
        });
        //
        this.module.data.openDb(function() {
            //
            chrome.runtime.onMessage.addListener(function(request, _, sendRes) {
                // request
                console.log(request);
                let module = request.module,
                    method = request.method,
                    data = request.data;
                //
                if (method === 'ready') {
                    self.ready();
                } else {
                    if (self.module[module] && self.module[module][method]) {
                        let r = self.module[module][method](data);
                        if (r) {
                            sendRes(r);
                            return false;
                        }
                    }
                }
                sendRes('');
            });
            //
            self.module.initialize();
        }, function() {
            console.log('open db failed.');
        });
        //
        Model.set('notebooks', '').watch('notebooks', this.renderNotebooks);
        Model.set('notes', '').watch('notes', this.renderNotes);
        Model.set('content', '').watch('content', this.renderPreview);
        Model.set('editorData', '').watch('editorData', this.renderEditorData);
        Model.set('notebookCheckLock', '').watch('notebookCheckLock', this.notifyNotebookCheckLock);
        Model.set('notebookIsLock', '').watch('notebookIsLock', this.notebookLock);
    };

    this.notebookLock = function(status) {
        self.sendMessageToFront('folder', 'lock', status);
    };

    this.notifyNotebookCheckLock = function(result) {
        self.sendMessageToFront('folder', 'checkLockResult', result);
    };

    this.renderEditorData = function(data) {
        self.sendMessageToFront('editor', 'renderEditorData', data);
    }

    this.renderPreview = function(content) {
        self.sendMessageToFront('previewer', 'renderContent', content);
    }

    this.renderNotebooks = function(notebooks) {
        self.sendMessageToFront('folder', 'renderNotebooks', notebooks);
    };

    this.renderNotes = function(notes) {
        self.sendMessageToFront('notes', 'renderNotes', notes);
    };

    this.ready = function() {
        this.module.data.notebookLockCache = [];
        this.module.data.readAllNoteBooks(function(res) {
            self.module.data.readAllNotes();
        });
    };

    this.openReaderMode = function(info, tab) {
        chrome.tabs.sendMessage(tab.id, {
            module: 'content',
            method: 'openReaderMode',
            data: tab.url
        }, function (response) {});
        // self.sendMessage('content', 'openReaderMode', {});
        // chrome.storage.sync.set({version:Version.currentVersion})
    };
});
