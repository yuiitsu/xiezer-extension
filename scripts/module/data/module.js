/**
 * Data
 * Created by onlyfu on 2020/09/17.
 */
App.module.extend('data', function() {
    //
    let self = this, 
        dbVersion = 4,
        dbName = 'xiezer',
        db = null, 
        currentDataKey = 'currentData', 
        noteLockCache = [],
        notebookLockCache = [], 
        notebookLocked = [];

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
        Model.set('note', '').watch('note', this.saveNote);
        Model.set('noteBookId', '').watch('noteBookId', this.readAllNotes);
        Model.set('noteId', '').watch('noteId', this.readNote);
        Model.set('notesOrder', Model.default.notesOrder).watch('notesOrder', this.readAllNotes);
        Model.set('searchKey', '').watch('searchKey', this.readAllNotes);
        Model.set('moveToNotebook', '').watch('moveToNotebook', this.moveToNotebook);
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
        };
    };

    this.saveNote = function(content) {
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
        let request = null, 
            noteId = Model.get('noteId'), 
            action = Model.get('action'); 
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
            data['notebook'] = Model.get('noteBookId');
            data['noteId'] = self._uuid();
            data['createAt'] = new Date().getTime();
            request = db.transaction(['notes'], 'readwrite')
                .objectStore('notes')
                .add(data);
            //
            request.onsuccess = function() {
                self.log('add data success.');
                self.readAllNotes();
                Model.set('noteId', data['noteId']);
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
    this.saveNoteBook = function(data, callback) {
        this.getNotebookByName(data.name, function(status, r) {
            if (!status) {
                let noteBookId = self._uuid();
                data['noteBookId'] = noteBookId;
                let request = db.transaction(['notebooks'], 'readwrite').objectStore('notebooks').add(data);
                request.onsuccess = function() {
                    self.log('add Notebook success.');
                    //
                    callback();
                    //
                    self.readAllNoteBooks();
                };
                request.onerror = function() {
                    self.log('add Notebook failed');
                };
            }
        });
    };

    this.updateNoteBook = function(data, callback) {
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
                callback();
                //
                self.readAllNoteBooks();
            };
            request.onerror = function() {
                self.log('update Notebook failed');
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

    this.deleteNoteBook = function(noteBookId, callback) {
        let request = db.transaction(['notebooks'], 'readwrite').objectStore('notebooks').delete(noteBookId);
        request.onsuccess = function() {
            self.readAllNoteBooks();
            callback();
        };
    };

    this.readAllNoteBooks = function(callback) {
        let objectStore = db.transaction('notebooks').objectStore('notebooks'), 
            result = [], 
            o = {};

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
                        isLocked: cursor.value.password ? true : false,
                        children: []
                    };
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
                console.log(result);
                Model.set('notebooks', result);
                //
                if ($.isFunction(callback)) {
                    callback();
                }
            }
        };
    };

    this.readAllNotes = function() {
        let objectStore = db.transaction('notes').objectStore('notes'), 
            result = [], 
            noteBookId = Model.get('noteBookId'), 
            searchKey = Model.get('searchKey'), 
            index = noteBookId ? 'notebook' : 'createAt', 
            order = Model.get('notesOrder');
        //
        noteBookId = noteBookId ? noteBookId : null;
        objectStore.index(index).openCursor(noteBookId, order).onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                let item = {
                    id: cursor.value.noteId,
                    title: cursor.value.title,
                    createAt: cursor.value.createAt ? self.module.component.timeToStr(cursor.value.createAt) : '',
                    createAtInt: cursor.value.createAt,
                    isLocked: cursor.value.password ? true : false,
                    notebook: cursor.value.notebook ? cursor.value.notebook : ''
                }, isLocked = false;
                //
                if (notebookLocked.indexOf(item.notebook) !== -1 && notebookLockCache.indexOf(item.notebook) === -1) {
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
                Model.set('notes', result);
                // self.readAllNoteBooks();
            }
        };
    };

    this.readNote = function(noteId) {
        if (noteId) {
            self.getOneNote(noteId, function(status, result) {
                if (status) {
                    Model.set('action', 'update');
                    Model.set('content', result.content);
                    Model.set('currentNote', result);
                    Model.set('editorData', result.content);
                }
            })
        } else {
            Model.set('action', 'new');
            Model.set('content', '');
            Model.set('currentNote', {});
            Model.set('editorData', '');
        }
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

    this.lockNote = function(noteId, password, callback) {
        this.getOneNote(noteId, function(status, data) {
            if (status) {
                data['password'] = self.module.component.md5(password);
                let request = db.transaction(['notes'], 'readwrite')
                    .objectStore('notes')
                    .put(data);
                //
                request.onsuccess = function() {
                    self.module.component.notification('Lock successfully.')
                    callback();
                };
                //
                request.onerror = function() {
                    self.module.component.notification('Lock failed.', 'danger')
                };
            }
        });
    };

    this.checkNoteLock = function(noteId, password, callback) {
        if (noteLockCache.indexOf(noteId) !== -1) {
            callback(true);
            return false;
        }
        this.getOneNote(noteId, function(status, data) {
            if (status) {
                if (data.password === self.module.component.md5(password)) {
                    noteLockCache.push(data.noteId);
                    callback(true);
                    return false;
                }
            }
            callback(false);
        });
    };

    this.noteHasUnlocked = function(noteId) {
        let i = noteLockCache.indexOf(noteId); 
        if (i !== -1) {
            noteLockCache.splice(i, 1);
            return true;
        }
        return false;
    };

    this.clearNoteLockPassword = function(noteId, password, callback) {
        this.getOneNote(noteId, function(status, data) {
            if (status) {
                if (data.password === self.module.component.md5(password)) {
                    data['password'] = '';
                    let request = db.transaction(['notes'], 'readwrite')
                        .objectStore('notes')
                        .put(data);
                    //
                    request.onsuccess = function() {
                        self.module.component.notification('Clear successfully.');
                        callback(true);
                    };
                    //
                    request.onerror = function() {
                        self.module.component.notification('Clear failed.', 'danger');
                        callback(false);
                    };
                }
            } else {
                callback(false);
            }
        });
    };

    this.lockNotebook = function(noteBookId, password, callback) {
        this.getNotebookById(noteBookId, function(status, data) {
            if (status) {
                data['password'] = self.module.component.md5(password);
                let request = db.transaction(['notebooks'], 'readwrite')
                    .objectStore('notebooks')
                    .put(data);
                //
                request.onsuccess = function() {
                    self.module.component.notification('Lock successfully.')
                    self.readAllNoteBooks(function() {
                        self.readAllNotes();
                    });
                    callback();
                };
                //
                request.onerror = function() {
                    self.module.component.notification('Lock failed.', 'danger')
                };
            }
        });
    };

    this.checkNotebookLock = function(notebookId, password, callback) {
        if (notebookLockCache.indexOf(notebookId) !== -1) {
            callback(true);
            return false;
        }
        this.getNotebookById(notebookId, function(status, data) {
            if (status) {
                if (data.password === self.module.component.md5(password)) {
                    notebookLockCache.push(data.noteBookId);
                    callback(true);
                    return false;
                }
            }
            callback(false);
        });
    };

    this.notebookHasUnlocked = function(notebookId) {
        let i = notebookLockCache.indexOf(notebookId); 
        if (i !== -1) {
            notebookLockCache.splice(i, 1);
            self.readAllNotes();
            return true;
        }
        return false;
    };

    this.clearNotebookLockPassword = function(notebookId, password, callback) {
        this.getNotebookById(notebookId, function(status, data) {
            if (status) {
                if (data.password === self.module.component.md5(password)) {
                    data['password'] = '';
                    let request = db.transaction(['notebooks'], 'readwrite')
                        .objectStore('notebooks')
                        .put(data);
                    //
                    request.onsuccess = function() {
                        self.module.component.notification('Clear successfully.');
                        self.readAllNoteBooks(function() {
                            self.readAllNotes();
                        });
                        callback(true);
                    };
                    //
                    request.onerror = function() {
                        self.module.component.notification('Clear failed.', 'danger');
                        callback(false);
                    };
                }
            } else {
                callback(false);
            }
        });
    };

    this.deleteNotes = function() {
        let notesChecked = Model.get('notesChecked');
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
            Model.set('notesChecked', []);
            //
            self.module.component.notification('Delete successfully!');
        });
    };

    this.getNoteCount = function(noteBookId, callback) {
        let transaction = db.transaction(['notes'], 'readonly');
        let objectStore = transaction.objectStore('notes');
        let countRequest = objectStore.count(noteBookId);
        countRequest.onsuccess = function() {
            console.log(countRequest.result);
            callback(countRequest.result);
        }
    };

    this.moveToNotebook = function() {
        let notesChecked = Model.get('notesChecked'), 
            moveToNotebookId = Model.get('moveToNotebookId');
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
                            Model.set('moveToNotebookId', '');
                            Model.set('isEditMode', false);
                            Model.set('notesChecked', []);
                            self.readAllNotes();
                            self.module.component.notification('Update successfully!');
                        };
                        //
                        request.onerror = function() {
                            self.log('add notebook error.')
                            self.module.component.notification('Update successfully!', 'warring');
                        };
                    } else {
                    }
                });
            });
        }
    };

    this.currentData = {
        get: function() {
            return localStorage.getItem(currentDataKey);
        },
        set: function() {
            localStorage.setItem(currentDataKey, Model.get('content'));
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
    }
});