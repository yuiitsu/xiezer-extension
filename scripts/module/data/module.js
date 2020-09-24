/**
 * Data
 * Created by onlyfu on 2020/09/17.
 */
App.module.extend('data', function() {
    //
    let self = this, 
        dbName = 'xiezer',
        db = null, 
        currentDataKey = 'currentData';

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
        this.openDb();
        //
        Model.set('note', '').watch('note', this.saveNote);
        Model.set('noteBookId', '').watch('noteBookId', this.readAllNotes);
        Model.set('noteId', '').watch('noteId', this.readNote);
        Model.set('notesOrder', Model.default.notesOrder).watch('notesOrder', this.readAllNotes);
    };

    this.openDb = function() {
        //
        let request = window.indexedDB.open(dbName, 1);
        //
        request.onerror = function(event) {
            self.log('open db error.');
        };
        //
        request.onsuccess = function() {
            db = request.result;
            self.log('open db success.');
            //
            self.readAllNotes();
            self.readAllNoteBooks();
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
        };
    };

    this.saveNote = function(content) {
        if (!content) {
            return false;
        }
        self.currentData.set(content);
        //
        let lines = content.split('\n'), 
            title = lines[0], 
            data = {
                title: title,
                content: content
            };
        //
        data['notebook'] = Model.get('noteBookId');
        let request = null, 
            noteId = Model.get('noteId'), 
            action = Model.get('action'), 
            currentNote = Model.get('currentNote');
        //
        if (noteId && action === 'update') {
            data['noteId'] = noteId;
            data['createAt'] = currentNote['createAt'];
            request = db.transaction(['notes'], 'readwrite')
                .objectStore('notes')
                .put(data);
            //
            request.onsuccess = function() {
                self.log('add data success.');
                self.readAllNotes();
            };
            //
            request.onerror = function() {
                self.log('add data error.')
            };
        } else {
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
        this.getNoteBook(data.name, function() {
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
        });
    };

    this.updateNoteBook = function(data, callback) {
        let request = db.transaction(['notebooks'], 'readwrite').objectStore('notebooks').put({
            noteBookId: data.noteBookId,
            name: data.name,
            parentId: data.parentId,
            showChildren: data.showChildren
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
    };

    this.getNoteBook = function(name, callback) {
        let transaction = db.transaction(['notebooks'], 'readonly');
        let store = transaction.objectStore('notebooks');
        let index = store.index('name');
        let request = index.get(name);
        //
        request.onsuccess = function (e) {
            let result = e.target.result;
            if (result) {
                self.log('data existed.');
            } else {
                // 
                callback();
            }
        }
    };

    this.deleteNoteBook = function(noteBookId, callback) {
        let request = db.transaction(['notebooks'], 'readwrite').objectStore('notebooks').delete(noteBookId);
        request.onsuccess = function() {
            self.readAllNoteBooks();
            callback();
        };
    };

    this.readAllNoteBooks = function() {
        let objectStore = db.transaction('notebooks').objectStore('notebooks'), 
            result = [], 
            o = {};
        //
        objectStore.openCursor().onsuccess = function (event) {
            let cursor = event.target.result; 
            if (cursor) {
                let id = cursor.key, 
                    parentId = cursor.value.parentId, 
                    name = cursor.value.name, 
                    showChildren = cursor.value.showChildren ? cursor.value.showChildren : '1',
                    d = {
                        id: id,
                        parentId: parentId,
                        name: name,
                        showChildren: showChildren,
                        children: []
                    };
                //
                if (parentId && !o[parentId]) {
                    o[parentId] = [];
                }
                if (!parentId) {
                    // o[id] = [];
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
                    }
                }
                Model.set('notebooks', result);
                self.log(result);
            }
        };
    };

    this.readAllNotes = function() {
        let objectStore = db.transaction('notes').objectStore('notes'), 
            result = [], 
            noteBookId = Model.get('noteBookId'), 
            index = noteBookId ? 'notebook' : 'createAt', 
            order = Model.get('notesOrder');
        //
        let sortCreateAt = function(a, b) {
            if (order === 'prev') {
                return -(a.createAtInt - b.createAtInt);
            } else {
                return a.createAtInt - b.createAtInt;
            }
        };
        //
        noteBookId = noteBookId ? noteBookId : null;
        objectStore.index(index).openCursor(noteBookId, order).onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                result.push({
                    id: cursor.value.noteId,
                    title: cursor.value.title,
                    createAt: cursor.value.createAt ? self.module.component.timeToStr(cursor.value.createAt) : '',
                    createAtInt: cursor.value.createAt
                });
                cursor.continue();
            } else {
                //
                result.sort(sortCreateAt);
                //
                Model.set('notes', result);
                self.log(result);
            }
        };
    };

    this.readNote = function(noteId) {
        if (noteId) {
            var transaction = db.transaction(['notes'], 'readonly');
            var store = transaction.objectStore('notes');
            var request = store.get(noteId);
            //
            request.onsuccess = function (e) {
                var result = e.target.result;
                if (result) {
                    Model.set('action', 'update');
                    Model.set('content', result.content);
                    Model.set('currentNote', result);
                    Model.set('editorData', result.content);
                } else {
                    // 
                    self.log('data not existed.');
                    // callback();
                }
                // self.readAllNoteBooks();
            }
        } else {
            Model.set('action', 'new');
            Model.set('content', '');
            Model.set('currentNote', {});
            Model.set('editorData', '');
        }
    };

    this.deleteNotes = function() {
        let notesChecked = Model.get('notesChecked');
        if (!notesChecked || notesChecked.length === 0) {
            return false;
        }
        //
        let del = function(list, callback) {
            let noteId = list.splice(0, 1);
            var request = db.transaction(['notes'], 'readwrite')
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