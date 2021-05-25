/**
 * Data
 * Created by onlyfu on 2020/09/17.
 */
App.module.extend('data', function() {
    //
    let self = this, 
        dbVersion = 6,
        dbName = 'xiezer',
        db = null, 
        // currentDataKey = 'currentData', 
        noteLockCache = [],
        notebookLocked = [];

    this.notebookLockCache = [];
    //
    Model.default = {
        action: 'new',
        currentNote: {},
        showToc: false,
        showNoteBook: false,
        scrollMaster: 'editor',
        notesOrder: 'prev',
        isAES: 0
    }

    this.init = function() {
        //
        let notesOrder = localStorage.getItem('notesOrder');
        if (notesOrder && ['prev', 'next'].indexOf(notesOrder) !== -1) {
            Model.set('notesOrder', notesOrder);
        }
        //
        let isAES = localStorage.getItem('isAES');
        if (isAES && isAES === '1') {
            Model.set('isAES', 1);
        }
        //
        Model.set('note', '').watch('note', this.saveNote);
        Model.set('notebookId', '').watch('notebookId', this.readAllNotes);
        // Model.set('noteId', '').watch('noteId', this.readNote);
        Model.watch('notesOrder', this.readAllNotes);
        // Model.set('searchKey', '').watch('searchKey', this.readAllNotes);
        // Model.set('moveToNotebook', '').watch('moveToNotebook', this.moveToNotebook);
        // Model.set('moveToNotebookSingle', '').watch('moveToNotebookSingle', this.moveToNotebookSingle);
        Model.set('latestImage', '').watch('latestImage', this.module.latestImages.save);
    };

    this.openDb = function(success, error) {
        //
        let request = window.indexedDB.open(dbName, dbVersion);
        //
        request.onerror = function(event) {
            self.log('open db error.');
            error();
        };
        //
        request.onsuccess = function() {
            db = request.result;
            self.log('open db success.');
            Model.set('db', db);
            //
            success();
        };
        //
        request.onupgradeneeded = function(event) {
            db = event.target.result;
            let objectStore;
            if (!db.objectStoreNames.contains('notebooks')) {
                objectStore = db.createObjectStore('notebooks', { keyPath: 'noteBookId' });
                objectStore.createIndex('name', 'name', { unique: true });
                objectStore.createIndex('parentId', 'parentId', { unique: false });
            }
            //
            if (!db.objectStoreNames.contains('notes')) {
                objectStore = db.createObjectStore('notes', { keyPath: 'noteId' });
                objectStore.createIndex('title', 'title', { unique: false });
                objectStore.createIndex('notebook', 'notebook', { unique: false });
                objectStore.createIndex('createAt', 'createAt', {unique: false});
            }
            //
            if (!db.objectStoreNames.contains('latestImages')) {
                objectStore = db.createObjectStore('latestImages', {keyPath: 'imageId'});
                objectStore.createIndex('createAt', 'createAt', {unique: false});
                // objectStore.createIndex('sha', 'sha', {unique: false});
            }
        };
    };

    this.saveNote = function(params) {
        let content = params.content,
            action = params.action,
            environment = params.environment,
            noteId = params.noteId, 
            AESSecret = params.AESSecret;
        if (!content) {
            return false;
        }
        // self.currentData.set(content);
        //
        let lines = content.split('\n'),
            title = lines[0], 
            data = {
                title: title.substr(0, 80),
                content: content
            };
        //
        if (Model.get('isAES') && AESSecret) {
            let encryptContent = CryptoJS.AES.encrypt(content, AESSecret).toString();
            data['content'] = encryptContent;
            data['isAESEncrypt'] = 1;
        } else {
            data['isAESEncrypt'] = 0;
        }
        
        // console.log(CryptoJS.AES.decrypt(encryptContent, '1234562').toString(CryptoJS.enc.Utf8));
        //
        let request = null;
            // noteId = environment === 'contentScript' && contentNoteId ? contentNoteId : Model.get('noteId');
            // action = Model.get('action');
            // currentNote = Model.get('currentNote');
        //
        if (noteId && action === 'update') {
            self.getOneNote(noteId, function(status, result) {
                if (status) {
                    data['noteId'] = noteId;
                    data['notebook'] = result.notebook;
                    data['createAt'] = result.createAt;
                    request = db.transaction(['notes'], 'readwrite')
                        .objectStore('notes')
                        .put(data);
                    //
                    request.onsuccess = function() {
                        self.log('add data success.');
                        if (result.title !== title) {
                            self.readAllNotes();
                        }
                    };
                    //
                    request.onerror = function() {
                        self.log('add data error.')
                    };
                } else {
                }
            });
        } else {
            data['notebook'] = Model.get('notebookId');
            data['noteId'] = noteId && environment === 'contentScript' ? noteId : self._uuid();
            data['createAt'] = new Date().getTime();
            request = db.transaction(['notes'], 'readwrite')
                .objectStore('notes')
                .add(data);
            //
            request.onsuccess = function() {
                self.log('add data success.');
                Model.set('noteId', data['noteId']);
                self.readAllNotes();
                self.readNote({
                    noteId: data['noteId'],
                    AESSecret: AESSecret
                });
            };
            //
            request.onerror = function() {
                self.log('add data error.')
            };
        }
    };

    /**
     * @param {*} data 
     *  data.name
     *  data.parentId
     * @param {*} callback 
     */
    this.saveNotebook = function(data, callback) {
        this.getNotebookByName(data.name, function(status, r) {
            if (!status) {
                data['noteBookId'] = self._uuid();
                let request = db.transaction(['notebooks'], 'readwrite').objectStore('notebooks').add(data);
                request.onsuccess = function() {
                    self.log('add Notebook success.');
                    //
                    self.readAllNoteBooks();
                    self.sendMessageToFront('folder', 'saveNotebookResult', true);
                };
                request.onerror = function() {
                    self.log('add Notebook failed');
                    self.sendMessageToFront('folder', 'saveNotebookResult', false);
                };
            }
        });
    };

    this.updateNotebook = function(data) {
        this.getNotebookById(data.noteBookId, function(status, r) {
            let request = db.transaction(['notebooks'], 'readwrite').objectStore('notebooks').put({
                noteBookId: data.noteBookId,
                name: data.name,
                parentId: data.parentId,
                showChildren: data.showChildren,
                password: r.password
            });
            request.onsuccess = function() {
                self.log('update Notebook success.');
                //
                self.readAllNoteBooks();
                self.sendMessageToFront('folder', 'updateNotebookResult', true);
            };
            request.onerror = function() {
                self.log('update Notebook failed');
                self.sendMessageToFront('folder', 'updateNotebookResult', false);
            };
        });
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

    this.getNotebookById = function(notebookId, callback) {
        let transaction = db.transaction(['notebooks'], 'readonly');
        let store = transaction.objectStore('notebooks');
        let request = store.get(notebookId);
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
    }

    this.deleteNotebook = function(noteBookId) {
        let request = db.transaction(['notebooks'], 'readwrite').objectStore('notebooks').delete(noteBookId);
        request.onsuccess = function() {
            self.readAllNoteBooks();
        };
    };

    this.setNotebookId = function(notebookId) {
        Model.set('notebookId', notebookId);
    };

    this.setNoteId = function(noteId) {
        Model.set('noteId', noteId);
    };

    this.readAllNoteBooks = function(callback) {
        let objectStore = db.transaction('notebooks').objectStore('notebooks'), 
            result = [], 
            o = {},
            currentNotebookId = Model.get('notebookId');

        notebookLocked = [];
        //
        objectStore.index('name').openCursor(null, 'next').onsuccess = function (event) {
            let cursor = event.target.result; 
            if (cursor) {
                let id = cursor.value.noteBookId, 
                    parentId = cursor.value.parentId, 
                    name = cursor.value.name, 
                    showChildren = cursor.value.showChildren ? cursor.value.showChildren : '1',
                    d = {
                        id: id,
                        parentId: parentId,
                        name: name,
                        showChildren: showChildren,
                        isLocked: !!cursor.value.password,
                        children: [],
                        selected: false
                    };
                //
                if (currentNotebookId && currentNotebookId === id) {
                    d.selected = true;
                }
                //
                if (d.isLocked && notebookLocked.indexOf(id) === -1) {
                    notebookLocked.push(id);
                }
                //
                if (parentId && !o[parentId]) {
                    o[parentId] = [];
                }
                if (!parentId) {
                    result.push(d);
                } else {
                    o[parentId].push(d);
                }
                //
                cursor.continue();
            } else {
                //
                for (let i = 0; i < result.length; i++) {
                    if (o[result[i]['id']]) {
                        result[i]['children'] = o[result[i]['id']];
                        delete o[result[i]['id']];
                    }
                }
                for (let i in o) {
                    if (o.hasOwnProperty(i)) {
                        result = result.concat(o[i]);
                    }
                }
                // console.log(result);
                Model.set('notebooks', result);
                //
                if ($.isFunction(callback)) {
                    callback(result);
                }
            }
        };
    };

    this.getNotebooks = function() {
        return Model.get('notebooks');
    };

    this.readAllNotes = function(options) {
        let objectStore = db.transaction('notes').objectStore('notes'),
            result = [], 
            notebookId = Model.get('notebookId'),
            searchKey = options && options.searchKey ? options.searchKey : Model.get('searchKey'),
            index = notebookId ? 'notebook' : 'createAt',
            order = Model.get('notesOrder'),
            noteId = Model.get('noteId');
        //
        notebookId = notebookId ? notebookId : null;
        objectStore.index(index).openCursor(notebookId, order).onsuccess = function (event) {
            let cursor = event.target.result;
            if (cursor) {
                let item = {
                    id: cursor.value.noteId,
                    title: cursor.value.title,
                    createAt: cursor.value.createAt ? self.module.component.timeToStr(cursor.value.createAt) : '',
                    createAtInt: cursor.value.createAt,
                    isLocked: !!cursor.value.password,
                    notebook: cursor.value.notebook ? cursor.value.notebook : '',
                    isSelected: !!(noteId && noteId === cursor.value.noteId),
                    isAESEncrypt: cursor.value.isAESEncrypt
                }, isLocked = false;
                //
                if (notebookLocked.indexOf(item.notebook) !== -1 && self.notebookLockCache.indexOf(item.notebook) === -1) {
                    isLocked = true;
                }
                //
                if (searchKey) {
                    if (cursor.value.title.indexOf(searchKey) !== -1) {
                        if (!isLocked) {
                            result.push(item);
                        }
                    }
                } else {
                    if (!isLocked) {
                        result.push(item);
                    }
                }
                cursor.continue();
            } else {
                //
                result.sort(function(a, b) {
                    if (order === 'prev') {
                        return -(a.createAtInt - b.createAtInt);
                    } else {
                        return a.createAtInt - b.createAtInt;
                    }
                });
                //
                // console.log(result);
                // Model.set('notes', result);
                self.sendMessageToFront('notes', 'renderNotes', result);
                // self.readAllNoteBooks();
            }
        };
    };

    this.readNote = function(params) {
        let noteId = params.noteId, 
            AESSecret = params.AESSecret;
        self.setNoteId(noteId);
        if (noteId) {
            self.getOneNote(noteId, function(status, result) {
                console.log(noteId, status, result);
                if (status) {
                    //
                    result.AESDecrypt = true;
                    if (Model.get('isAES') && AESSecret && result.isAESEncrypt === 1) {
                        let decryptContent = null;
                        try {
                            decryptContent = CryptoJS.AES.decrypt(result.content, AESSecret).toString(CryptoJS.enc.Utf8);
                        } catch (e){}
                        //
                        if (decryptContent) {
                            result.content = decryptContent;
                        } else {
                            result.AESDecrypt = false;
                        }
                    }
                    //
                    if (result.password && noteLockCache.indexOf(noteId) === -1) {
                        // show unlock note window
                        Model.set('noteId', '');
                        return false;
                    }
                    if (result.notebook && notebookLocked.indexOf(result.notebook) !== -1 && self.notebookLockCache.indexOf(result.notebook) === -1) {
                        // show unlock notebook window
                        return false;
                    }
                    Model.set('action', 'update');
                    // Model.set('content', result.content);
                    Model.set('currentNote', result);
                    // Model.set('currentNote', result);
                    // Model.set('editorData', result.content);
                    self.sendMessageToFront('editor', 'renderEditorData', result);
                    self.sendMessageToFront('previewer', 'renderContent', result);
                    localStorage.setItem('lastNoteId', noteId);
                } else {
                    self.sendMessageToFront('editor', 'dataNotExist', noteId);
                }
            })
        } else {
            Model.set('action', 'new');
            Model.set('content', '');
            // Model.set('currentNote', {});
            Model.set('editorData', '');
        }
    };

    this.reloadNote = function(params) {
        let currentNoteId = Model.get('noteId'),
            AESSecret = params.AESSecret;
        Model.set('noteId', currentNoteId);
        self.readNote({
            noteId: currentNoteId,
            AESSecret: AESSecret
        })
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

    this.lockNote = function(params) {
        this.getOneNote(params.noteId, function(status, data) {
            if (status) {
                data['password'] = self.module.component.md5(params.password);
                let request = db.transaction(['notes'], 'readwrite')
                    .objectStore('notes')
                    .put(data);
                //
                request.onsuccess = function() {
                    self.sendMessageToFront('notes', 'lockResult', true);
                };
                //
                request.onerror = function() {
                    self.sendMessageToFront('notes', 'lockResult', false);
                };
            }
        });
    };

    this.checkNoteLock = function(params) {
        if (noteLockCache.indexOf(params.noteId) !== -1) {
            params['status'] = true;
            self.sendMessageToFront('notes', 'checkNoteLockResult', params);
            return false;
        }
        this.getOneNote(params.noteId, function(status, data) {
            if (status) {
                if (data.password === self.module.component.md5(params.password)) {
                    noteLockCache.push(data.noteId);
                    params['status'] = true;
                    self.sendMessageToFront('notes', 'checkNoteLockResult', params);
                    return false;
                }
            }
            params['status'] = false;
            self.sendMessageToFront('notes', 'checkNoteLockResult', params);
        });
    };

    this.noteHasUnlocked = function(noteId) {
        let i = noteLockCache.indexOf(noteId); 
        if (i !== -1) {
            noteLockCache.splice(i, 1);
            self.sendMessageToFront('notes', 'lock', {
                noteId: noteId,
                status: true
            });
            // return true;
        } else {
            self.sendMessageToFront('notes', 'lock', {
                noteId: noteId,
                status: false
            });
        }
        // return false;
    };

    this.clearNoteLockPassword = function(params) {
        this.getOneNote(params.noteId, function(status, data) {
            if (status) {
                if (data.password === self.module.component.md5(params.password)) {
                    data['password'] = '';
                    let request = db.transaction(['notes'], 'readwrite')
                        .objectStore('notes')
                        .put(data);
                    //
                    request.onsuccess = function() {
                        // self.module.component.notification('Clear successfully.');
                        self.sendMessageToFront('notes', 'clearLockResult', true);
                    };
                    //
                    request.onerror = function() {
                        // self.module.component.notification('Clear failed.', 'danger');
                        self.sendMessageToFront('notes', 'clearLockResult', true);
                    };
                }
            } else {
                callback(false);
            }
        });
    };

    this.lockNotebook = function(params) {
        this.getNotebookById(params.noteBookId, function(status, data) {
            if (status) {
                data['password'] = self.module.component.md5(params.password);
                let request = db.transaction(['notebooks'], 'readwrite')
                    .objectStore('notebooks')
                    .put(data);
                //
                request.onsuccess = function() {
                    // self.module.component.notification('Lock successfully.')
                    self.readAllNoteBooks(function() {
                        self.readAllNotes();
                    });
                    //
                    // callback();
                    self.sendMessageToFront('folder', 'lockResult', true);
                    // self.sendMessage('component', 'notification', 'Lock successfully.');
                };
                //
                request.onerror = function() {
                    // self.module.component.notification('Lock failed.', 'danger')
                    self.sendMessageToFront('folder', 'lockResult', false);
                    self.sendMessageToFront('component', 'notification', {
                        type: 'danger',
                        msg: 'Lock failed.'
                    });
                };
            }
        });
    };

    /**
     *
     * @param params
     *  params.notebookId
     *  params.password
     * @returns {boolean}
     */
    this.checkNotebookLock = function(params) {
        if (self.notebookLockCache.indexOf(params.notebookId) !== -1) {
            params['status'] = true;
            Model.set('notebookCheckLock', params)
            Model.set('notebookId', params.notebookId);
            return false;
        }
        this.getNotebookById(params.notebookId, function(status, data) {
            if (status) {
                if (data.password === self.module.component.md5(params.password)) {
                    self.notebookLockCache.push(data.noteBookId);
                    params['status'] = true;
                    Model.set('notebookCheckLock', params)
                    Model.set('notebookId', params.notebookId);
                    return false;
                }
            }
            params['status'] = false;
            Model.set('notebookCheckLock', params)
        });
    };

    this.notebookHasUnlocked = function(notebookId) {
        let i = self.notebookLockCache.indexOf(notebookId);
        if (i !== -1) {
            self.notebookLockCache.splice(i, 1);
            self.readAllNotes();
            // return true;
            // Model.set('notebookIsLock', {
            //     notebookId: notebookId,
            //     status: true
            // });
            self.sendMessageToFront('folder', 'lock', {
                notebookId: notebookId,
                status: true
            });
        } else {
            // return false;
            // Model.set('notebookIsLock', {
            //     notebookId: notebookId,
            //     status: false
            // });
            self.sendMessageToFront('folder', 'lock', {
                notebookId: notebookId,
                status: false
            });
        }
    };

    this.clearNotebookLockPassword = function(params) {
        this.getNotebookById(params.notebookId, function(status, data) {
            if (status) {
                if (data.password === self.module.component.md5(params.password)) {
                    data['password'] = '';
                    let request = db.transaction(['notebooks'], 'readwrite')
                        .objectStore('notebooks')
                        .put(data);
                    //
                    request.onsuccess = function() {
                        self.readAllNoteBooks(function() {
                            self.readAllNotes();
                        });
                        self.sendMessageToFront('folder', 'clearLockResult', true);
                    };
                    //
                    request.onerror = function() {
                        self.sendMessageToFront('folder', 'clearLockResult', false);
                    };
                }
            } else {
                self.sendMessageToFront('folder', 'clearLockResult', false);
            }
        });
    };

    this.deleteNote = function(noteId) {
        if (!noteId) {
            return false;
        }

        let request = db.transaction(['notes'], 'readwrite')
            .objectStore('notes')
            .delete(noteId);

        request.onsuccess = function (event) {
            console.log('deleted: ' + noteId);
            if (noteId === Model.get('noteId')) {
                Model.set('noteId', '');
            }
            //
            self.sendMessageToFront('editor', 'clearEditor', noteId);
            self.readAllNotes();
            self.sendMessageToFront('notes', 'deleteNotesResult', true);
        };
    };

    this.deleteNotes = function(noteIds) {
        let notesChecked = noteIds;
        if (!notesChecked || notesChecked.length === 0) {
            return false;
        }
        //
        let del = function(list, callback) {
            let noteId = list.splice(0, 1);
            let request = db.transaction(['notes'], 'readwrite')
                .objectStore('notes')
                .delete(noteId[0]);

            request.onsuccess = function (event) {
                console.log('deleted: ' + noteId);
                if (noteId[0] === Model.get('noteId')) {
                    Model.set('noteId', '');
                }
                //
                if (list.length > 0) {
                    del(list, callback);
                } else {
                    callback();
                }
            };
        };
        //
        del(notesChecked, function() {
            self.readAllNotes();
            //
            // Model.set('notesChecked', []);
            //
            // self.module.component.notification('Delete successfully!');
            self.sendMessageToFront('notes', 'deleteNotesResult', true);
        });
    };

    this.moveToNotebook = function(params) {
        // let notesChecked = Model.get('notesChecked'),
        //     moveToNotebookId = Model.get('moveToNotebookId');
        let notesChecked = params.notesChecked,
            moveToNotebookId = params.moveToNotebookId;
        //
        moveToNotebookId = moveToNotebookId ? moveToNotebookId : '';
        //
        if (notesChecked.length > 0) {
            notesChecked.forEach(element => {
                self.getOneNote(element, function(status, data) {
                    if (status) {
                        data['notebook'] = moveToNotebookId;
                        let request = db.transaction(['notes'], 'readwrite')
                            .objectStore('notes')
                            .put(data);
                        //
                        request.onsuccess = function() {
                            self.log('update notebook success.');
                            // Model.set('moveToNotebookId', '');
                            // Model.set('isEditMode', false);
                            // Model.set('notesChecked', []);
                            self.readAllNotes();
                            // self.module.component.notification('Update successfully!');
                            self.sendMessageToFront('notes', 'moveToNoteBookResult', true);
                        };
                        //
                        request.onerror = function() {
                            self.log('add notebook error.')
                            // self.module.component.notification('Update successfully!', 'warring');
                            self.sendMessageToFront('notes', 'moveToNoteBookResult', false);
                        };
                    } else {
                    }
                });
            });
        }
    };

    this.moveToNotebookSingle = function(params) {
        let moveToNotebookId = params.moveToNotebookId,
            noteId = params.noteId;
        //
        moveToNotebookId = moveToNotebookId ? moveToNotebookId : '';
        //
        self.getOneNote(noteId, function(status, data) {
            if (status) {
                data['notebook'] = moveToNotebookId;
                let request = db.transaction(['notes'], 'readwrite')
                    .objectStore('notes')
                    .put(data);
                //
                request.onsuccess = function() {
                    self.log('update notebook success.');
                    // Model.set('moveToNotebookId', '');
                    self.readAllNotes();
                    // self.module.component.notification('Update successfully!');
                    self.sendMessageToFront('notes', 'moveToNoteBookSingleResult', true);
                };
                //
                request.onerror = function() {
                    self.log('add notebook error.')
                    // self.module.component.notification('Update successfully!', 'warring');
                    self.sendMessageToFront('notes', 'moveToNoteBookSingleResult', false);
                };
            } else {
            }
        });
    };

    this.setNotesOrder = function(notesOrder) {
        Model.set('notesOrder', notesOrder);
    };

    this.clearCurrentNote = function () {
        Model.set('content', '');
        Model.set('editorData', '');
    };

    this.getLastNote = function(params) {
        let lastNoteId = localStorage.getItem('lastNoteId');
        if (lastNoteId) {
            // Model.set('noteId', lastNoteId);
            params['noteId'] = lastNoteId
            self.readNote(params);
        }
    };

    this.setDefaultLibAndPath = function(data) {
        this.setLocalStorage({
            key: 'defaultLibAndPath',
            data: JSON.stringify(data)
        });
        Model.set('defaultPath', {
            lib: data.lib,
            path: data.path
        })
    };

    this.getDefaultLibAndPath = function() {
        return this.getLocalStorage('defaultLibAndPath');
    };

    this.setIsAES = function(isAES) {
        self.setLocalStorage({
            key: 'isAES',
            data: isAES
        })
        Model.set('isAES', isAES);
    };

    this.getIsAES = function() {
        return Model.get('isAES');
    };

    this.getSettings = function() {
        let isAES = self.getIsAES();
        return {
            isAES: isAES
        }
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