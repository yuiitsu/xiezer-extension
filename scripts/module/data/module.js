/**
 * Data
 * Created by onlyfu on 2020/09/17.
 */
App.module.extend('data', function() {
    //
    let self = this, 
        dbName = 'xiezer',
        db = null, 
        currentDataKey = 'currentData', 
        currentId = '';

    this.init = function() {
        //
        this.openDb();
        //
        Model.set('note', '').watch('note', this.saveData);
        // Model.set('content', '').watch('content', this.saveData);
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
            self.log(db);
            self.log('open db success.');
            //
            self.readAllNotes();
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

    this.saveData = function(content) {
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
        let request = null;
        if (currentId) {
            data['key'] = currentId;
            request = db.transaction(['notes'], 'readwrite')
                .objectStore('notes')
                .put(data);
        } else {
            request = db.transaction(['notes'], 'readwrite')
                .objectStore('notes')
                .add(data);
        }
        //
        request.onsuccess = function() {
            self.log('add data success.');
        };
        //
        request.onerror = function() {
            self.log('add data error.')
        };
    };

    this.saveNoteBook = function(name, callback) {

        this.getNoteBook(name, callback);
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
        objectStore.openCursor().onsuccess = function (event) {
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

    this.currentData = {
        get: function() {
            return localStorage.getItem(currentDataKey);
        },
        set: function() {
            localStorage.setItem(currentDataKey, Model.get('content'));
        }
    }
});