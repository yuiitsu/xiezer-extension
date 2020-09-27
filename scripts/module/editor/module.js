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
        Model.set('editorScrollTop', 0).watch('editorScrollTop', this.renderScrollTop);
        Model.set('notesOpened', false).watch('notesOpened', this.renderActionIcon);
        //
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
        let target = $('.editor-content');
        target.val(data);
        target.scrollTop(0);
        //
        Model.set('editorCharactersCount', data.length);
        Model.set('editorAutoSaved', '');
        Model.set('notesOpened', true);
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

    this.renderScrollTop = function(percent) {
        let target = $('.editor-content'), 
            scrollHeight = target.prop('scrollHeight'), 
            clientHeight = target.outerHeight(),
            scrollTop = (scrollHeight - clientHeight) * percent;
        //
        $('.editor-content').animate({scrollTop: scrollTop}, 0);
    };

    this.renderActionIcon = function(status) {
        let target = $('.action-item-link-note');
        if (status) {
            target.removeClass('disabled');
        } else {
            target.addClass('disabled');
        }
    }
});