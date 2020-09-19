/**
 * Editor
 * Created by onlyfu on 2020/09/16.
 */
App.module.extend('editor', function() {
    //
    let self = this;

    this.init = function() {
        //
        Model.set('editor_data', '').watch('editor_data', this.renderEditorData);
        //
        let currentData = this.module.data.currentData.get();
        if (currentData) {
            Model.set('content', currentData);
            Model.set('editor_data', currentData);
        }
        self.view.display('editor', 'layout', {content: currentData ? currentData : ''}, $('#editor'));
    };

    this.previewNote = function(content) {
        Model.set('content', content);
    };

    this.saveNote = function(content) {
        Model.set('note', content);
    };

    this.renderEditorData = function(data) {
        $('.editor-content').val(data);
    };
});