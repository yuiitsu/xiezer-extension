/**
 * Editor
 * Created by onlyfu on 2020/09/16.
 */
App.module.extend('editor', function() {
    //
    let self = this;

    this.init = function() {
        //
        Model.set('editorData', '').watch('editorData', this.renderEditorData);
        Model.set('editorCharactersCount', 0).watch('editorCharactersCount', this.renderCharactersCount);
        Model.set('editorAutoSaved', '').watch('editorAutoSaved', this.renderAutoSaved);
        Model.set('content', '').watch('content', this.renderEditorData);
        self.view.display('editor', 'layout', {content: ''}, $('#editor'));
    };

    this.previewNote = function(content) {
        Model.set('content', content);
    };

    this.saveNote = function(content) {
        Model.set('note', content);
    };

    this.renderEditorData = function(data) {
        //
        self.event.editor.clearTimer();
        //
        $('.editor-content').val(data);
        //
        Model.set('editorCharactersCount', data.length);
        Model.set('editorAutoSaved', '');
    };

    this.renderCharactersCount = function(n) {
        $('.editor-entity-characters-count').find('span').text(n);
    };

    this.renderAutoSaved = function(savedAt) {
        let container = $('.editor-entity-autosave-status');
        if (savedAt) {
            self.view.display('editor', 'autoSavedTips', {savedAt: savedAt}, container);
        } else {
            container.html('');
        }
    };
});