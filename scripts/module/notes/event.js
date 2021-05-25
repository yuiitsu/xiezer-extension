/**
 * Notes Event
 */
App.event.extend('notes', function() {

    let self = this;

    this.event = {
        newNote: function() {
            $('#notes-new-button').on('click', function() {
                self.module.init.switchPreviewMode('false');
                let content = '# Untitled\n', 
                    AESSecret = Model.get('AESSecret');
                //
                Model.set('action', 'new');
                // Model.set('note', content);
                let sendData = {
                    action: 'new',
                    content: content,
                    // AESSecret: Model.get('AESSecret'),
                    AESSecret: AESSecret ? (AESSecret === '{{notUse}}' ? '' : AESSecret) : ''
                    // environment: Model.get('environment')
                    // contentNoteId: Model.get('contentNoteId')
                }
                console.log(sendData);
                self.sendMessage('data', 'saveNote', sendData);
            });
        },
        openNote: function() {
            $('.notes-items').on('click', '.notes-item', function() {
                let _this = $(this), 
                    noteId = $(this).attr('data-id');
                if (!noteId) {
                    return false;
                }
                //
                Model.set('clickNoteElement', _this);
                //
                let isEditMode = Model.get('isEditMode');
                if (isEditMode) {
                    let notesChecked = Model.get('notesChecked'), 
                        i = notesChecked.indexOf(noteId);
                    if (i !== -1) {
                        notesChecked.splice(i, 1);
                        $(this).removeClass('notes-edit-selected');
                    } else {
                        notesChecked.push(noteId);
                        $(this).addClass('notes-edit-selected');
                    }
                    Model.set('notesChecked', notesChecked);
                } else {
                    //
                    if ($(this).hasClass('is-locked')) {
                        let title = $(this).attr('data-title');
                        
                        let container = self.module.component.module({
                            name: 'Unlock note',
                            width: 300,
                        }, self.view.getView('component', 'unlockForm', {
                            id: noteId,
                            name: title
                        }), '');
                        //
                        container.find('#password').focus();
                        //
                        container.find('.unlock-confirm').off('click').on('click', function() {
                            let passwordElement = container.find('#password'), 
                                password = passwordElement.val();
                            //
                            passwordElement.removeClass('error');
                            if (!password) {
                                passwordElement.addClass('error');
                                return false;
                            }
                            //
                            self.module.data.checkNoteLock(noteId, password, function(status) {
                                //
                                // if (status) {
                                //     Model.set('noteId', noteId);
                                //     Model.set('previewerScrollTop', 0);
                                //     _this.removeClass('is-locked');
                                //     container.remove();
                                //     //
                                //     $('.notes-item').removeClass('focus');
                                //     _this.addClass('focus');
                                // } else {
                                //     self.module.component.dialog().ok('Unlock failed. Password error.', 'Unlock note', function() {
                                //         let target = container.find('#password');
                                //         target.focus();
                                //         target.select();
                                //     });
                                // }
                            });
                        });
                    } else {
                        Model.set('noteId', noteId);
                        Model.set('previewerScrollTop', 0);
                        //
                        $('.notes-item').removeClass('focus');
                        $(this).addClass('focus');
                    }
                }
            });
        },
        headerAction: function() {
            $('.notes-header-action').on('click', function() {
                let mode = $(this).attr('data-mode'), 
                    isMode = Model.get(mode);
                //
                if (mode === 'isSearchMode' && Model.get('searchKey')) {
                    return false;
                }
                Model.set(mode, !isMode);
            });
        },
        search: function() {
            $('.notes-items').on('keydown', '#notes-search', function(e) {
                if (e.keyCode === 13) {
                    let searchKey = $.trim($(this).val());
                    Model.set('searchKey', searchKey);
                }
                e.stopPropagation();
            });
        },
        editModeAction: function() {
            $('.notes-items').on('click', '.notes-edit-action-item', function(e) {
                let action = $(this).attr('data-action'),
                    notesChecked = Model.get('notesChecked');
                //
                if (notesChecked.length === 0) {
                    return false;
                } 
                //
                switch (action) {
                    case 'delete':
                        self.module.component.dialog().show('confirm', 'Delte notes', 'Are you sure you want to delete these?', function() {
                            self.module.data.deleteNotes();
                        });
                        break;
                    case 'moveToNoteBook':
                        self.module.notes.showMoveToNoteBook();
                        break;
                }
                e.stopPropagation();
            });
        },
        order: function() {
            $('#notes-order').on('click', function() {
                let notesOrder = Model.get('notesOrder');
                notesOrder = notesOrder === 'prev' ? 'next' : 'prev';
                Model.set('notesOrder', notesOrder);
                //
                localStorage.setItem('notesOrder', notesOrder);
            });
        },
        selectMoveToNotebookId: function() {
            $('body').on('click', '.folder-selector-item', function(e) {
                //
                $('.folder-selector-item').removeClass('focus');
                //
                let notebookId = $(this).attr('data-id');
                if (notebookId) {
                    $(this).addClass('focus');
                }
                Model.set('moveToNotebookId', notebookId);
                e.stopPropagation();
            });
        },
        moveToNoteBook: function() {
            $('body').on('click', '.notes-move-to-notebook-ok', function(e) {
                let noteId = $(this).attr('data-id');
                if (noteId) {
                    Model.set('moveToNotebookSingle', noteId);
                } else {
                    Model.set('moveToNotebook', new Date().getTime());
                }
                $('.module-box').remove();
                e.stopPropagation();
            });
        },
        previewOnly: function() {
            $('.notes-items').on('click', '.preview-only', function(e) {
                self.module.init.switchPreviewMode('true');
                e.stopPropagation();
            });
        },
        lock: function() {
            $('.notes-items').on('click', '.lock-container', function(e) {
                let _this = $(this), 
                    noteId = $(this).attr('data-id'), 
                    name = $(this).attr('data-name'), 
                    action = $(this).attr('data-action');
                //
                Model.set('currentNoteLock', _this);
                if (action === 'lock') {
                    //
                    self.module.data.noteHasUnlocked(noteId);
                } else {
                    let container = self.module.component.module({
                        name: 'Clear password',
                        width: 300
                    }, self.view.getView('component', 'unlockForm', {
                        id: noteId,
                        name: name
                    }), '');
                    //
                    container.find('.unlock-confirm').off('click').on('click', function() {
                        let noteId = $(this).attr('data-id'), 
                            password = container.find('#password').val(); 
                        //
                        if (!password) {
                            container.find('.form-control').addClass('error');
                            return false;
                        } else {
                            container.find('.form-control').removeClass('error');
                        }
                        //
                        self.module.data.clearNoteLockPassword(noteId, password);
                    });
                }
                e.stopPropagation();
            });
        },
        contexMenu: function() {
            $('.notes-items').on('contextmenu', '.notes-item', function(e) {
                let noteId = $(this).attr('data-id');
                self.module.component.tips.show($(this), self.view.getView('notes', 'listActions', {
                    noteId: noteId
                }), {
                }, null, e);
                e.stopPropagation();
                return false;
            })
        },
        actionClick: function() {
            $('body').on('click', '.notes-item-action-item', function(e) {
                let action = $(this).attr('data-action'), 
                    noteId = $(this).attr('data-id');
                //
                if (!action || !noteId) {
                    return false;
                }
                // action
                switch (action) {
                    case "move":
                        self.module.notes.showMoveToNoteBook(noteId);
                        break;
                    case "delete":
                        self.module.component.dialog().show('confirm', 'Delete Note', 'Are you sure you want to delete it?', function() {
                            self.module.data.deleteNote(noteId);
                        });
                        break;
                }
                e.stopPropagation();
            });
        }
    }
});