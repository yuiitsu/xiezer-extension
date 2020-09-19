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

    this.init = function() {
        //
        this.openDb();
        //
        Model.set('note', '').watch('note', this.saveNote);
        Model.set('noteBookId', '').watch('noteBookId', this.readAllNotesById);
        Model.set('noteId', '').watch('noteId', this.readNote);
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
            // self.initDb(db);
            let objectStore;
            if (!db.objectStoreNames.contains('notebooks')) {
                objectStore = db.createObjectStore('notebooks', { keyPath: 'noteBookId' });
                objectStore.createIndex('name', 'name', { unique: true });
            }
            //
            if (!db.objectStoreNames.contains('notes')) {
                objectStore = db.createObjectStore('notes', { keyPath: 'noteId' });
                objectStore.createIndex('title', 'title', { unique: false });
                objectStore.createIndex('notebook', 'notebook', { unique: false });
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
            noteId = Model.get('noteId');
        if (noteId) {
            data['noteId'] = parseInt(noteId);
            request = db.transaction(['notes'], 'readwrite')
                .objectStore('notes')
                .put(data);
            //
            request.onsuccess = function() {
                self.log('add data success.');
                if (data['notebook']) {
                    self.readAllNotesById(data['notebook']);
                } else {
                    self.readAllNotes();
                }
            };
            //
            request.onerror = function() {
                self.log('add data error.')
            };
        } else {
            // data['noteId'] = self._uuid();
            self.getNoteCount(null, function(count) {
                data['noteId'] = count + 1;
                request = db.transaction(['notes'], 'readwrite')
                    .objectStore('notes')
                    .add(data);
                //
                request.onsuccess = function() {
                    self.log('add data success.');
                    if (data['notebook']) {
                        self.readAllNotesById(data['notebook']);
                    } else {
                        self.readAllNotes();
                    }
                };
                //
                request.onerror = function() {
                    self.log('add data error.')
                };
            });
        }
    };

    this.saveNoteBook = function(name, callback) {

        this.getNoteBook(name, function() {
            let noteBookId = self._uuid();
            let request = db.transaction(['notebooks'], 'readwrite').objectStore('notebooks').add({
                noteBookId: noteBookId,
                name: name
            });
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
            name: data.name
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
        var transaction = db.transaction(['notebooks'], 'readonly');
        var store = transaction.objectStore('notebooks');
        var index = store.index('name');
        var request = index.get(name);
        //
        request.onsuccess = function (e) {
            var result = e.target.result;
            if (result) {
                self.log('data existed.');
            } else {
                // 
                callback();
            }
        }
    };

    this.readAllNoteBooks = function() {
        let objectStore = db.transaction('notebooks').objectStore('notebooks'), 
            result = [];
        //
        objectStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                result.push({
                    id: cursor.key,
                    name: cursor.value.name
                });
                cursor.continue();
            } else {
                self.log(result);
                Model.set('notebooks', result);
            }
        };
    };

    this.readAllNotes = function() {
        let objectStore = db.transaction('notes').objectStore('notes'), 
            result = [];
        //
        objectStore.openCursor(null, 'next').onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                result.push({
                    id: cursor.key,
                    title: cursor.value.title
                });
                cursor.continue();
            } else {
                self.log(result);
                Model.set('notes', result);
            }
        };
    };

    this.readNote = function(noteId) {
        var transaction = db.transaction(['notes'], 'readonly');
        var store = transaction.objectStore('notes');
        var request = store.get(parseInt(noteId));
        //
        request.onsuccess = function (e) {
            var result = e.target.result;
            if (result) {
                self.log('data existed.');
                self.log(result);
                Model.set('content', result.content);
                Model.set('editor_data', result.content);
            } else {
                // 
                self.log('data not existed.');
                // callback();
            }
            // self.readAllNoteBooks();
        }
    };

    this.readAllNotesById = function(noteBookId) {
        if (!noteBookId) {
            self.readAllNotes();
            self.readAllNoteBooks();
            return false;
        }
        let transaction = db.transaction(['notes'], 'readonly');
        let store = transaction.objectStore('notes');
        let request = store.index('notebook').openCursor(noteBookId, 'next');
        // let request = index.get(noteBookId).openCursor();
        let result = [];
        //
        request.onsuccess = function (e) {
            var cursor = e.target.result;
            if (cursor) {
                result.push({
                    id: cursor.key,
                    title: cursor.value.title
                });
                cursor.continue();
            }
            Model.set('notes', result);
            self.readAllNoteBooks();
        }
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