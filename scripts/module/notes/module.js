/**
 * Notes
 * Created by onlyfu on 2020/09/16.
 */
App.module.extend('notes', function() {
    //
    let self = this;

    this.init = function() {
        //
        this.view.display('notes', 'layout', {notesOrder: Model.get('notesOrder')}, $('#notes'));
        //
        // Model.set('notes', '').watch('notes', this.renderNotes);
        Model.set('isEditMode', false).watch('isEditMode', this.renderEditMode);
        // Model.set('isSearchMode', false).watch('isSearchMode', this.renderNotes);
        Model.set('notesChecked', []).watch('notesChecked', this.renderEditLine);
        Model.watch('notesOrder', this.renderOrderIcon);
        Model.watch('isEditMode', this.renderEditIcon);
        Model.watch('isSearchMode', this.renderSearchIcon);
        //
        // Model.set('isSearchMode', true);
        //
        // this.module.data.readAllNotes();
    };

    this.renderNotes = function(data) {
        let notes = data ? data : Model.get('notes'),
            // selectedNoteId = Model.get('noteId'),
            isEditMode = Model.get('isEditMode'),
            isSearchMode = Model.get('isSearchMode'),
            notesChecked = Model.get('notesChecked'), 
            searchKey = Model.get('searchKey'), 
            scrollTop = Model.get('notesScrollTop');
        //
        console.log(data);
        self.view.display('notes', 'list', {
            list: notes, 
            // selectedNoteId: selectedNoteId,
            notesChecked: notesChecked,
            isEditMode: isEditMode,
            isSearchMode: isSearchMode,
            searchKey: searchKey
        }, $('.notes-items'));
        //
        $('.notes-items-container').scrollTop(scrollTop ? scrollTop : 0);
        Model.set('notesScrollTop', 0);
        //
        $('#notes-count').text(notes.length);
    };

    this.renderActionMode = function(action) {
        $('.notes-header-action').removeClass('focus');
        if (action) {
            let target = $('#notes-header-action-' + action);
            target.addClass('focus');
        }
    };

    this.renderEditIcon = function(status) {
        let target = $('#notes-header-action-edit');
        if (status) {
            target.addClass('focus');
        } else {
            target.removeClass('focus');
        }
    };

    this.renderSearchIcon = function(status) {
        let target = $('#notes-header-action-search');
        if (status) {
            target.addClass('focus');
        } else {
            target.removeClass('focus');
        }
    };

    this.renderOrderIcon = function(order) {
        self.view.display('notes', 'order_' + order, {}, $('#notes-order'));
    };

    this.showMoveToNoteBook = function(noteId) {
        let actionView = self.view.getView('notes', 'moveToNotebook', {noteId: noteId ? noteId : ''});
        //
        self.sendMessage('data', 'getNotebooks', {}, function(notebooks) {
            let view = self.module.folder.getSelectorView(notebooks);
            //
            self.module.component.module({
                name: 'Select Notebook',
                width: 300
            }, view + actionView, '');
        });
    };

    this.renderEditMode = function(status) {
        let target = $('.notes-items');
        if (status) {
            target.addClass('notes-edit-mode');
        } else {
            target.removeClass('notes-edit-mode');
        }
    };

    this.renderEditLine = function(notesChecked) {
        let target = $('.notes-edit-line');
        if (notesChecked.length > 0) {
            target.addClass('is-selected');
        } else {
            target.removeClass('is-selected');
        }
    };

    this.checkNoteLockResult = function(result) {
        //
        let status = result.status,
            noteId = result.noteId,
            container = $(Model.get('currentModuleComponent')),
            _this = $(Model.get('clickNoteElement'))

        if (status) {
            Model.set('noteId', noteId);
            Model.set('previewerScrollTop', 0);
            _this.removeClass('is-locked');
            container.remove();
            //
            $('.notes-item').removeClass('focus');
            _this.addClass('focus');
        } else {
            self.module.component.dialog().ok('Unlock failed. Password error.', 'Unlock note', function() {
                let target = container.find('#password');
                target.focus();
                target.select();
            });
        }
    };

    this.lock = function(result) {
        let _this = Model.get('currentNoteLock'),
            status = result.status,
            noteId = result.noteId;
        //
        if (status) {
            _this.parent().parent().parent().parent().addClass('is-locked');
        } else {
            let container = self.module.component.module({
                name: 'Lock note',
                width: 300
            }, self.view.getView('component', 'lockForm', {
                id: noteId,
                name: name
            }), '');
            //
            container.find('.lock-confirm').off('click').on('click', function() {
                let noteId = $(this).attr('data-id'),
                    password = container.find('#password').val(),
                    confirmPassword = container.find('#confirm-password').val();
                //
                if (!password || !confirmPassword || password !== confirmPassword) {
                    container.find('.form-control').addClass('error');
                    return false;
                } else {
                    container.find('.form-control').removeClass('error');
                }
                //
                self.module.data.lockNote(noteId, password);
            });
        }
    };

    this.lockResult = function(status) {
        let _this = $(Model.get('currentNoteLock')),
            container = $(Model.get('currentModuleComponent'));
        //
        if (status) {
            self.module.component.notification('Lock successfully.')
            _this.parent().parent().parent().parent().addClass('is-locked');
            container.remove();
        } else {
            self.module.component.notification('Lock failed.', 'danger')
        }
    };

    this.clearLockResult = function(status) {
        let _this = $(Model.get('currentNoteLock')),
            container = $(Model.get('currentModuleComponent'));
        //
        if (status) {
            _this.parent().parent().parent().parent().removeClass('is-locked');
            container.remove();
        }
    };

    this.moveToNoteBookResult = function(status) {
        let container = $(Model.get('currentModuleComponent'));
        if (status) {
            Model.set('moveToNotebookId', '');
            Model.set('isEditMode', false);
            Model.set('notesChecked', []);
            self.module.component.notification('Update successfully!');
            container.remove();
        } else {
            self.module.component.notification('Update successfully!', 'warring');
        }
    };

    this.moveToNoteBookSingleResult = function(status) {
        let container = $(Model.get('currentModuleComponent'));
        if (status) {
            Model.set('moveToNotebookId', '');
            self.module.component.notification('Update successfully!');
            container.remove();
        } else {
            self.module.component.notification('Update successfully!', 'warring');
        }
    };

    this.deleteNotesResult = function(status) {
        if (status) {
            Model.set('notesChecked', []);
            //
            self.module.component.notification('Delete successfully!');
        } else {
            self.module.component.notification('Delete failed!');
        }
    };
});