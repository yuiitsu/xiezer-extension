/**
 * Data
 * Created by onlyfu on 2020/09/17.
 */
App.module.extend('data', function() {
    //
    let self = this, 
        db = null,
        noteLockCache = [];

    //
    Model.default = {
        action: 'new',
        currentNote: {},
        showToc: false,
        showNoteBook: false,
        scrollMaster: 'editor',
        notesOrder: 'prev'
    }

    this.init = function() {
        //
        let notesOrder = localStorage.getItem('notesOrder');
        if (notesOrder && ['prev', 'next'].indexOf(notesOrder) !== -1) {
            Model.set('notesOrder', notesOrder);
        }
        //
        // this.openDb();
        //
        Model.set('environment', 'page');
        console.log('content script data module');
        // Model.set('note', '').watch('note', this.saveNote);
        // Model.set('noteBookId', '').watch('noteBookId', this.readAllNotes);
        Model.set('noteId', '').watch('noteId', this.readNote);
        Model.set('notesOrder', Model.default.notesOrder).watch('notesOrder', this.setNotesOrder);
        // Model.watch('notesOrder', this.readAllNotes);
        Model.set('searchKey', '').watch('searchKey', this.readAllNotes);
        Model.set('moveToNotebook', '').watch('moveToNotebook', this.moveToNotebook);
        Model.set('moveToNotebookSingle', '').watch('moveToNotebookSingle', this.moveToNotebookSingle);
        Model.set('latestImage', '').watch('latestImage', this.latestImages.save);
    };

    // this.saveNote = function(content) {
    //     if (!content) {
    //         return false;
    //     }
    //     self.sendMessage('data', 'saveNote', {
    //         action: Model.get('action'),
    //         content: content,
    //         environment: Model.get('environment'),
    //         contentNoteId: Model.get('contentNoteId')
    //     });
    // };

    /**
     * @param {*} data 
     *  data.name
     *  data.parentId
     */
    this.saveNotebook = function(data) {
        self.sendMessage('data', 'saveNotebook', data);
    };

    this.updateNotebook = function(data, callback) {
        self.sendMessage('data', 'updateNotebook', data);
    };

    this.getNotebookByName = function(name, callback) {
        let transaction = db.transaction(['notebooks'], 'readonly');
        let store = transaction.objectStore('notebooks');
        let index = store.index('name');
        let request = index.get(name);
        //
        request.onsuccess = function (e) {
            let result = e.target.result;
            if (result) {
                self.log('data existed.');
                callback(true, result);
            } else {
                // 
                callback(false, null);
            }
        }
    };

    this.deleteNotebook = function(noteBookId, callback) {
        self.sendMessage('data', 'deleteNotebook', noteBookId);
    };

    this.readAllNotes = function() {
        self.sendMessage('data', 'readAllNotes', {
            searchKey: Model.get('searchKey')
        });
    };

    this.readNote = function(noteId) {
        self.sendMessage('data', 'readNote', {
            noteId: noteId,
            AESSecret: Model.get('AESSecret')
        });
    };

    this.getOneNote = function(noteId, callback) {
        var transaction = db.transaction(['notes'], 'readonly');
        var store = transaction.objectStore('notes');
        var request = store.get(noteId);
        //
        request.onsuccess = function (e) {
            var result = e.target.result;
            if (result) {
                callback(true, result);
            } else {
                self.log('data not existed.');
                callback(false, result);
            }
        }
    };

    this.lockNote = function(noteId, password) {
        self.sendMessage('data', 'lockNote', {
            noteId: noteId,
            password: password
        })
    };

    this.checkNoteLock = function(noteId, password, callback) {
        self.sendMessage('data', 'checkNoteLock', {
            noteId: noteId,
            password: password
        })
    };

    this.noteHasUnlocked = function(noteId) {
        self.sendMessage('data', 'noteHasUnlocked', noteId);
    };

    this.clearNoteLockPassword = function(noteId, password) {
        self.sendMessage('data', 'clearNoteLockPassword', {
            noteId: noteId,
            password: password
        });
    };

    this.lockNotebook = function(noteBookId, password, callback) {
        self.sendMessage('data', 'lockNotebook', {
            noteBookId: noteBookId,
            password: password
        })
    };

    this.checkNotebookLock = function(notebookId, password, container, _this) {
        self.sendMessage('data', 'checkNotebookLock', {
            notebookId: notebookId,
            password: password,
            container: container,
            _this: _this
        });
    };

    this.notebookHasUnlocked = function(notebookId) {
        self.sendMessage('data', 'notebookHasUnlocked', notebookId);
    };

    this.clearNotebookLockPassword = function(notebookId, password, callback) {
        self.sendMessage('data', 'clearNotebookLockPassword', {
            notebookId: notebookId,
            password: password
        })
    };

    this.deleteNote = function(noteId) {
        if (!noteId) {
            return false;
        }
        self.sendMessage('data', 'deleteNote', noteId, function() {});
    };

    this.deleteNotes = function() {
        let notesChecked = Model.get('notesChecked');
        if (!notesChecked || notesChecked.length === 0) {
            return false;
        }
        self.sendMessage('data', 'deleteNotes', notesChecked);
    };

    this.moveToNotebook = function() {
        let notesChecked = Model.get('notesChecked'),
            moveToNotebookId = Model.get('moveToNotebookId');
        //
        moveToNotebookId = moveToNotebookId ? moveToNotebookId : '';
        self.sendMessage('data', 'moveToNotebook', {
            notesChecked: notesChecked,
            moveToNotebookId: moveToNotebookId
        });
    };

    this.moveToNotebookSingle = function(noteId) {
        let moveToNotebookId = Model.get('moveToNotebookId');
        //
        moveToNotebookId = moveToNotebookId ? moveToNotebookId : '';
        self.sendMessage('data', 'moveToNotebookSingle', {
            noteId: noteId,
            moveToNotebookId: moveToNotebookId
        });
    };

    this.setNotesOrder = function(notesOrder) {
        self.sendMessage('data', 'setNotesOrder', notesOrder);
    };

    this.clearCurrentNote = function () {
        Model.set('content', '');
        Model.set('editorData', '');
    };

    this.setDefaultLibAndPath = function(lib, path) {
        self.sendMessage('data', 'setDefaultLibAndPath', {
            lib: lib,
            path: path
        }, function(res) {
            console.log(res);
        });
    };

    this.getDefaultLibAndPath = function() {
        return this.getLocalStorage('defaultLibAndPath');
    };

    this.setLocalStorage = function(params) {
        let key = params.key,
            data = params.data;
        //
        localStorage.setItem(key, data);
    };

    this.getLocalStorage = function(key) {
        return localStorage.getItem(key);
    }

    this.latestImages = {
        /**
         * @param {*} data 
         *  data.name
         *  data.url
         */
        save: function(data) {
            if (!data || !data.name || !data.url || !data.sha) {
                return false;
            }
            data['imageId'] = data.sha;
            data['createAt'] = new Date().getTime();
            data['lib'] = Model.get('useLib');
            data['type'] = 'file';
            self.sendMessage('latestImages', 'save', data);
        },
        query: function(callback) {
            self.sendMessage('latestImages', 'query');
        },
        delete: function(imageId, callback) {
            self.sendMessage('latestImages', 'delete', imageId);
        }
    };

    this._uuid = function() {
        var d = Date.now();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    };
});