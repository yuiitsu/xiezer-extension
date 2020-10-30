/**
 * Latest Images
 */
App.module.extend('latestImages', function() {
    let self = this,
        db = null;

    this.init = function() {
        db = Model.get('db');
    };

    this.save = function(data) {
        if (!data || !data.name || !data.url || !data.sha) {
            return false;
        }
        data['imageId'] = data.sha;
        data['createAt'] = new Date().getTime();
        data['lib'] = Model.get('useLib');
        data['type'] = 'file';
        request = db.transaction(['latestImages'], 'readwrite')
            .objectStore('latestImages')
            .add(data);
        //
        request.onsuccess = function() {
        };
        //
        request.onerror = function() {
            self.log('add data error.')
        };
    };
    this.query = function(callback) {
        let objectStore = db.transaction('latestImages').objectStore('latestImages'),
            result = [],
            index = 'createAt';
        //
        objectStore.index(index).openCursor(null, 'prev').onsuccess = function (event) {
            let cursor = event.target.result;
            if (cursor) {
                result.push(cursor.value);
                cursor.continue();
            } else {
                //
                // console.log(result);
                // Model.set('imageList', result);
                self.sendMessageToFront('images', 'queryLatestImagesResult', result);
            }
            if ($.isFunction(callback)) {
                callback();
            }
        };
    };
    this.delete = function(imageId) {
        let request = db.transaction(['latestImages'], 'readwrite')
            .objectStore('latestImages')
            .delete(imageId);

        request.onsuccess = function (event) {
            self.log('delete latest image successfully. imageId: ' + imageId);
            self.sendMessageToFront('images', 'deleteResult', true);
        };
    }
});
