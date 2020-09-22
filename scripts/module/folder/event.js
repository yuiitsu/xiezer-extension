/**
 * Folder Event
 */
App.event.extend('folder', function() {

    let self = this, 
        clickTimer = null, 
        dbClick = false;

    this.event = {
        showOff: function() {
            $('.bottom-bar-switch-button').on('click', function() {
                $('.folder-main').parent().hide();
            });
        },

        newNoteBook: function() {
            $('.notes-container').on('click', '.folder-add', function() {
                $('#folder-list').prepend(self.view.getView('folder', 'newNoteBook', {}));
            });
        },

        closeNewNoteBook: function() {
            $('.notes-container').on('click', '.folder-new-note-close', function() {
                $(this).parent().remove();
            });
        },

        loadNotes: function() {
            //
            let allNotesElement = $('.all-notes');
            allNotesElement.on('click', function() {
                Model.set('noteBookId', '');
                $(this).addClass('focus');
            });
            //
            $('#folder-list').on('click', '.folder-item', function(e) {
                let noteBookId = $(this).attr('data-id'); 
                clickTimer = setTimeout(function() {
                    if (!noteBookId || dbClick) {
                        dbClick = false;
                        return false;
                    }
                    //
                    allNotesElement.removeClass('focus');
                    Model.set('noteBookId', noteBookId);
                }, 200);
                //
                e.stopPropagation();
            });
        },

        editShow: function() {
            $('#folder-list').on('dblclick', '.folder-item', function(e) {
                clearTimeout(clickTimer);
                dbClick = true;
                //
                let noteBookId = $(this).attr('data-id'), 
                    name = $(this).text();
                if (!noteBookId || !name) {
                    return false;
                }
                //
                self.view.display('folder', 'list_item_edit', {
                    id: noteBookId,
                    name: name
                }, $(this).parent());
                //
                e.stopPropagation();
            });
        },

        edit: function() {
            let d = function(target) {
                let noteBookId = target.attr('data-id'), 
                    originalName = target.attr('data-name'), 
                    name = $.trim(target.val());
                
                //
                if (noteBookId) {
                    //
                    if (!name) {
                        return false;
                    }
                    // update
                    if (name !== originalName) {
                        self.log('do update');
                        self.module.data.updateNoteBook({
                            noteBookId: noteBookId,
                            name: name
                        }, function() {});
                    }
                } else {
                    if (name) {
                        // add
                        self.module.data.saveNoteBook(name, function() {

                        });
                    } else {
                        // pass
                        target.parent().parent().parent().remove();
                    }
                }
            };
            //
            $('#folder-list').on('keydown', '.folder-item-edit-input', function(e) {
                if (e.keyCode === 13) {
                    d($(this));
                }
                e.stopPropagation();
            });
            //
            $('#folder-list').on('click', '.folder-item-edit-save-button', function(e) {
                d($(this).prev());
            });
        },

        actionsShow: function() {
            $('#folder-list').on('click', '.folder-action-item-more', function(e) {
                let noteBookId = $(this).attr('data-id');
                self.module.component.tips.show($(this), self.view.getView('folder', 'listActions', {
                    noteBookId: noteBookId
                }), {
                }, $(this).parent());
                //
                e.stopPropagation();
            });
        },

        actionClick: function() {
            $('#folder-list').on('click', '.folder-item-action-item', function() {
                let action = $(this).attr('data-action'), 
                    noteBookId = $(this).attr('data-id');
                //
                if (!action || !noteBookId) {
                    return false;
                }
                // action
                self.module.component.dialog().show('confirm', 'Delete?', function() {
                    alert('delete');
                });
            });
        }
    }
});