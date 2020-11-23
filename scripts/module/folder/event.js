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
            $('.folder-switch').on('click', function() {
                $('#folder').hide();
                // $('.folder-mini').show();
                Model.set('miniSwitch', true);
                //
                self.setNoteBookSwitch(false); 
            });
            //
            $('body').on('click', '.folder-mini', function(e) {
                $('#folder').show();
                Model.set('miniSwitch', false);
                self.setNoteBookSwitch(true); 
                e.stopPropagation();
            });
        },

        newNoteBook: function() {
            let target = $('.notebooks-container');
            // level 1
            target.on('click', '.folder-add', function() {
                let elementId = self.module.component.timeToStr();
                $('#folder-list').prepend(self.view.getView('folder', 'newNoteBook', {elementId: elementId}));
                $('input[data-element-id="'+ elementId +'"]').focus();
            });
            // level 2
            target.on('click', '.folder-add-child', function() {
                let parentId = $(this).attr('data-id'), 
                    elementId = self.module.component.timeToStr();
                $(this).parent().parent().after(self.view.getView('folder', 'newNoteBook', {parentId: parentId, elementId: elementId}));
                $('input[data-element-id="'+ elementId +'"]').focus();
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
                $('.folder-child').removeClass('focus');
                // Model.set('noteBookId', '');
                self.sendMessage('data', 'setNotebookId', '');
                $(this).addClass('focus');
            });
            //
            $('#folder-list').on('click', '.folder-item', function(e) {
                let _this = $(this), 
                    noteBookId = $(this).attr('data-id'); 
                //
                if (!noteBookId || dbClick) {
                    dbClick = false;
                    return false;
                }
                //
                Model.set('clickNotebookElement', _this);
                //
                // allNotesElement.removeClass('focus');
                if (_this.parent().hasClass('is-locked')) {
                    let name = _this.text();
                    let container = self.module.component.module({
                        name: 'Unlock notebook',
                        width: 300
                    }, self.view.getView('component', 'unlockForm', {
                        id: noteBookId,
                        name: name
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
                        self.module.data.checkNotebookLock(noteBookId, password, container[0], _this[0]);
                    });
                } else {
                    // Model.set('noteBookId', noteBookId);
                    self.sendMessage('data', 'setNotebookId', noteBookId);
                    //
                    $('.folder-child').removeClass('focus');
                    _this.parent().addClass('focus');
                    allNotesElement.removeClass('focus');
                }
                e.stopPropagation();
            });
        },

        edit: function() {
            let d = function(target) {
                let noteBookId = target.attr('data-id'), 
                    parentId = target.attr('data-parent-id'),
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
                    self.module.data.updateNotebook({
                        parentId: parentId,
                        noteBookId: noteBookId,
                        name: name
                    });
                } else {
                    if (name) {
                        // add
                        self.module.data.saveNotebook({
                            name: name, 
                            parentId: parentId
                        });
                    } else {
                        // pass
                    }
                }
            };
            //
            let target = $('#folder-list');
            target.on('keydown', '.folder-item-edit-input', function(e) {
                if (e.keyCode === 13) {
                    d($(this));
                }
                e.stopPropagation();
            });
            //
            target.on('click', '.folder-item-edit-save-button', function(e) {
                d($(this).prev().find('input'));
            });
        },

        childrenSwitch: function() {
            $('#folder-list').on('click', '.folder-child-extend-icon', function(e) {
                let noteBookId = $(this).parent().attr('data-id'), 
                    name = $(this).parent().attr('data-name'), 
                    showChildren = $(this).parent().attr('data-show-children');
                //
                showChildren = showChildren === '1' ? '0' : '1';
                //
                self.module.data.updateNotebook({
                    parentId: '',
                    noteBookId: noteBookId,
                    name: name,
                    showChildren: showChildren
                }, function() {});
                //
                e.stopPropagation();
            });
        },

        actionClick: function() {
            $('#folder-list').on('click', '.folder-item-action-item', function(e) {
                let action = $(this).attr('data-action'), 
                    noteBookId = $(this).attr('data-id'), 
                    parentId = $(this).attr('data-parent-id');
                //
                if (!action || !noteBookId) {
                    return false;
                }
                // action
                switch (action) {
                    case "new":
                        let elementId = self.module.component.timeToStr();
                        parentId = $(this).attr('data-id');
                        $('.folder-child[data-id="'+ parentId +'"]').after(self.view.getView('folder', 'newNoteBook', {parentId: parentId, elementId: elementId}))
                        $('input[data-element-id="'+ elementId +'"]').focus();
                        $('#tips-box').remove();
                        break;
                    case "edit":
                        let name = $(this).attr('data-name');
                        if (!noteBookId || !name) {
                            return false;
                        }
                        parentId = parentId ? parentId : '';
                        //
                        self.view.display('folder', 'list_item_edit', {
                            id: noteBookId,
                            name: name,
                            parentId: parentId,
                            elementId: ''
                        }, $(".folder-child[data-id='"+ noteBookId +"']"));
                        break;
                    case "delete":
                        self.module.component.dialog().show('confirm', 'Delete notebook', 'Are you sure you want to delete these?', function() {
                            self.module.data.deleteNotebook(noteBookId, function() {});
                        });
                        break;
                }
                e.stopPropagation();
            });
        },

        lock: function() {
            $('#folder-list').on('click', '.lock-container', function(e) {
                let _this = $(this), 
                    notebookId = $(this).attr('data-id'), 
                    name = $(this).attr('data-name'), 
                    action = $(this).attr('data-action');
                //
                Model.set('currentNotebookLock', _this);
                if (action === 'lock') {
                    //
                    self.module.data.notebookHasUnlocked(notebookId);
                } else {
                    let container = self.module.component.module({
                        name: 'Clear password',
                        width: 300
                    }, self.view.getView('component', 'unlockForm', {
                        id: notebookId,
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
                        self.module.data.clearNotebookLockPassword(noteId, password, function(status) {
                            if (status) {
                                _this.parent().parent().parent().removeClass('is-locked');
                                container.remove();
                            }
                        });
                    });
                }
                e.stopPropagation();
            });
        },
        contexMenu: function() {
            $('.notebooks-container').on('contextmenu', '.folder-item', function(e) {
                let noteBookId = $(this).attr('data-id'), 
                    parentId = $(this).attr('data-parent-id'), 
                    name = $(this).text();
                self.module.component.tips.show($(this), self.view.getView('folder', 'listActions', {
                    noteBookId: noteBookId,
                    parentId: parentId ? parentId : '',
                    name: name
                }), {
                }, $(this));
                e.stopPropagation();
                return false;
            })
        }
    }
});