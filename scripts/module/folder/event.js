/**
 * Folder Event
 */
App.event.extend('folder', function() {

    let self = this, 
        clickTimer = null, 
        dbClick = false;

    this.setNoteBookSwitch = function(status) {
        Model.set('showNoteBook', status);
    }

    this.event = {
        showOff: function() {
            //
            $('.bottom-bar-switch-button').on('click', function() {
                $('#folder').hide();
                $('.folder-mini').show();
                //
                self.setNoteBookSwitch(false); 
            });
            //
            $('.folder-mini').on('click', function() {
                $('#folder').show();
                $(this).hide();
                self.setNoteBookSwitch(true); 
            });
        },

        newNoteBook: function() {
            // level 1
            $('.notebooks-container').on('click', '.folder-add', function() {
                $('#folder-list').prepend(self.view.getView('folder', 'newNoteBook', {}));
            });
            // level 2
            $('.notebooks-container').on('click', '.folder-add-child', function() {
                let parentId = $(this).attr('data-id');
                $(this).parent().parent().after(self.view.getView('folder', 'newNoteBook', {parentId: parentId}));
            });
        },

        closeNewNoteBook: function() {
            $('.notebooks-container').on('click', '.folder-new-note-close', function() {
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
                    parentId = $(this).attr('data-parent-id'),
                    name = $(this).text();
                if (!noteBookId || !name) {
                    return false;
                }
                parentId = parentId ? parentId : '';
                //
                self.view.display('folder', 'list_item_edit', {
                    id: noteBookId,
                    name: name,
                    parentId: parentId
                }, $(this).parent());
                //
                e.stopPropagation();
            });
        },

        edit: function() {
            let d = function(target) {
                let noteBookId = target.attr('data-id'), 
                    parentId = target.attr('data-parent-id'),
                    originalName = target.attr('data-name'), 
                    name = $.trim(target.val());
                
                //
                parentId = parentId ? parentId : '';
                //
                if (noteBookId) {
                    //
                    if (!name) {
                        return false;
                    }
                    // update
                    if (name !== originalName) {
                        self.module.data.updateNoteBook({
                            parentId: parentId,
                            noteBookId: noteBookId,
                            name: name
                        }, function() {});
                    }
                } else {
                    if (name) {
                        // add
                        self.module.data.saveNoteBook({
                            name: name, 
                            parentId: parentId
                        }, function() {});
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

        childrenSwitch: function() {
            $('#folder-list').on('click', '.folder-child-extend-icon', function(e) {
                let noteBookId = $(this).attr('data-id'), 
                    name = $(this).attr('data-name'), 
                    showChildren = $(this).attr('data-show-children');
                //
                showChildren = showChildren === '1' ? '0' : '1';
                //
                self.module.data.updateNoteBook({
                    parentId: '',
                    noteBookId: noteBookId,
                    name: name,
                    showChildren: showChildren
                }, function() {});
                //
                e.stopPropagation();
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
                    self.module.data.deleteNoteBook(noteBookId, function() {});
                });
            });
        }
    }
});