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
                let isNotesEditMode = Model.get('isNotesEditMode');
                if (isNotesEditMode) {
                    let notesChecked = Model.get('notesChecked'), 
                        i = notesChecked.indexOf(noteId);
                    if (i !== -1) {
                        notesChecked.splice(i, 1);
                    } else {
                        notesChecked.push(noteId);
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
            $('#notes-header-action').on('click', function() {
                let isNotesEditMode = Model.get('isNotesEditMode');
                Model.set('isNotesEditMode', !isNotesEditMode);
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
        }
    }
});