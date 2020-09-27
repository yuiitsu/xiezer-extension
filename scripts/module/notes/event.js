/**
 * Notes Event
 */
App.event.extend('notes', function() {

    let self = this;

    this.event = {
        newNote: function() {
            $('#notes-new-button').on('click', function() {
                let content = '# Untitled\n';
                Model.set('action', 'new');
                Model.set('note', content);
            });
        },
        openNote: function() {
            $('.notes-items').on('click', '.notes-item', function() {
                let noteId = $(this).attr('data-id');
                if (!noteId) {
                    return false;
                }
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
                    Model.set('noteId', noteId);
                    //
                    $('.notes-item').removeClass('focus');
                    $(this).addClass('focus');
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
                        self.module.component.dialog().show('confirm', 'Are you sure you want to delete these?', function() {
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
                Model.set('moveToNotebook', new Date().getTime());
                $('.module-box').remove();
                e.stopPropagation();
            });
        }
    }
});