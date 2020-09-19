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

        showForm: function() {
            $('.notes-container').on('click', '.folder-add', function() {
                let parent = $(this).attr('data-parent');
                self.view.append('folder', 'form', {});
                //
                let target = $('#folderForm');
                target.modal('show');
                //
                target.find('#folderSaveButton').on('click', function() {
                    let name = $.trim($('#notebook-name').val());
                    if (!name) {
                        return false;
                    }
                    //
                    self.module.data.saveNoteBook(name, function() {
                        target.modal('dispose');
                    });
                });
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
                if (!name) {
                    return false;
                }
                //
                if (name !== originalName) {
                    self.log('do update');
                    self.module.data.updateNoteBook({
                        noteBookId: noteBookId,
                        name: name
                    }, function() {});
                }
                //
                self.view.display('folder', 'list_item', {
                    id: noteBookId,
                    name: name
                }, target.parent().parent().parent());
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