/**
 * Editor
 * Created by onlyfu on 2020/09/16.
 */
App.module.extend('editor', function() {
    //
    let self = this;

    this.init = function() {
        //
        let currentData = this.module.data.currentData.get();
        if (currentData) {
            Model.set('content', currentData);
        }
        this.view.display('editor', 'layout', {content: currentData ? currentData : ''}, $('#editor'));
    };

    this.saveData = function(content) {
        Model.set('content', content);
        // Model.set('note', content);
    }
});