/**
 * Editor
 * Created by onlyfu on 2020/09/16.
 */
App.module.extend('editor', function() {
    //
    let self = this,
        dataNotExist = true,
        noteId = '';

    this.init = function() {
        let AESSecret = Model.get('AESSecret');
        AESSecret = AESSecret ? (AESSecret === '{{notUse}}' ? '' : AESSecret) : '';
        //
        Model.set('editorData', '').watch('editorData', this.renderEditorData);
        Model.set('editorCharactersCount', 0).watch('editorCharactersCount', this.renderCharactersCount);
        Model.set('editorAutoSaved', '').watch('editorAutoSaved', this.renderAutoSaved);
        Model.set('editorScrollTop', 0).watch('editorScrollTop', this.renderScrollTop);
        Model.set('notesOpened', false).watch('notesOpened', this.renderActionIcon);
        Model.set('editorRange', {});
        //
        self.view.display('editor', 'layout', {
            content: '',
            withKey: AESSecret
        }, $('#xiezer-editor'));
    };

    this.previewNote = function(content) {
        Model.set('content', content);
        Model.set('editorModifyTime', new Date().getTime());
        Model.set('editorCharactersCount', content.length);
    };

    this.saveNote = function(content) {
        let AESSecret = Model.get('AESSecret');
        Model.set('action', dataNotExist ? 'new' : 'update');
        // Model.set('note', content);
        let sendData = {
            action: Model.get('action'),
            content: content,
            environment: Model.get('environment'),
            noteId: noteId,
            AESSecret: AESSecret ? (AESSecret === '{{notUse}}' ? '' : AESSecret) : ''
        }
        console.log(sendData);
        self.sendMessage('data', 'saveNote', sendData);
    };

    this.renderEditorData = function(data) {
        let content = data.content, 
            AESDecrypt = data.AESDecrypt, 
            $decryptionTips = $('.editor-decrypt-falied-tips'), 
            $contentEditor = $('#editor-content');

        //
        if (!AESDecrypt) {
            $decryptionTips.show();
            $contentEditor.attr('disabled', true);
        } else {
            $decryptionTips.hide();
            $contentEditor.attr('disabled', false);
        }
        noteId = data.noteId;
        self.event.editor.clearTimer();
        console.log('editor noteId: ' + noteId);
        //
        let target = $('.editor-content');
        target.val(content);
        target.scrollTop(0);
        //
        // Model.set('contentNoteId', noteId);
        Model.set('editorCharactersCount', content.length);
        Model.set('editorAutoSaved', '');
        // Model.set('notesOpened', true);
        dataNotExist = false;
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
        target.animate({scrollTop: scrollTop}, 0);
    };

    this.renderActionIcon = function(status) {
        let target = $('.action-item-link-note');
        if (status) {
            target.removeClass('disabled');
        } else {
            target.addClass('disabled');
        }
    };
    
    this.insertContent = function(str) {
        let container = $('.editor-content'), 
            containerElement = container[0],
            editorRange = Model.get('editorRange'), 
            rangeStart = editorRange.rangeStart,
            rangeEnd = editorRange.rangeEnd,
            // selectedContent = editorRange.selectedContent,
            content = '', 
            scrollTop = container.scrollTop();
        //
        if (!editorRange.rangeStart) {
            content = container.val() + str;
        } else {
            //
            var contentPrev = containerElement.value.substring(0, rangeStart);
            var contentNext = containerElement.value.substring(rangeEnd);
            content = contentPrev + str + contentNext;
            container.focus();
            containerElement.setSelectionRange(rangeEnd, rangeEnd);
        }
        container.val(content);
        container.trigger('change');
        container.scrollTop(scrollTop);
    };

    this.dataNotExist = function(result) {
        dataNotExist = true;
        noteId = result;
    };

    this.clearEditor = function(noteId) {}
});