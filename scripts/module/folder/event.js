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
            // level 1
            $('.notebooks-container').on('click', '.folder-add', function() {
                let elementId = self.module.component.timeToStr();
                $('#folder-list').prepend(self.view.getView('folder', 'newNoteBook', {elementId: elementId}));
                $('input[data-element-id="'+ elementId +'"]').focus();
            });
            // level 2
            $('.notebooks-container').on('click', '.folder-add-child', function() {
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
                Model.set('noteBookId', '');
                $(this).addClass('focus');
            });
            //
            $('#folder-list').on('click', '.folder-item', function(e) {
                let _this = $(this), 
                    noteBookId = $(this).attr('data-id'); 
                //
                clickTimer = setTimeout(function() {
                    if (!noteBookId || dbClick) {
                        dbClick = false;
                        return false;
                    }
                    //
                    // allNotesElement.removeClass('focus');
                    if (_this.parent().hasClass('is-locked')) {
                        let name = _this.text();
                        let container = self.module.component.module({
                            name: 'UnLock notebook',
                            width: 300
                        }, self.view.getView('component', 'unlockForm', {
                            id: noteBookId,
                            name: name
                        }), '');
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
                            self.module.data.checkNotebookLock(noteBookId, password, function(status) {
                                //
                                if (status) {
                                    Model.set('noteBookId', noteBookId);
                                    _this.parent().removeClass('is-locked');
                                    container.remove();
                                    //
                                    $('.folder-child').removeClass('focus');
                                    _this.parent().addClass('focus');
                                    allNotesElement.removeClass('focus');
                                } else {
                                    self.module.component.dialog().ok('Unlock failed. Password error.', function() {
                                        let target = container.find('#password');
                                        target.focus();
                                        target.select();
                                    });
                                }
                            });
                        });
                    } else {
                        Model.set('noteBookId', noteBookId);
                        //
                        $('.folder-child').removeClass('focus');
                        _this.parent().addClass('focus');
                        allNotesElement.removeClass('focus');
                    }
                    //
                    // Model.set('noteBookId', noteBookId);
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
                    parentId: parentId,
                    elementId: ''
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
                    self.module.data.updateNoteBook({
                        parentId: parentId,
                        noteBookId: noteBookId,
                        name: name
                    }, function() {});
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
                let noteBookId = $(this).parent().attr('data-id'), 
                    name = $(this).parent().attr('data-name'), 
                    showChildren = $(this).parent().attr('data-show-children');
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
                self.module.component.dialog().show('confirm', 'Are you sure you want to delete these?', function() {
                    self.module.data.deleteNoteBook(noteBookId, function() {});
                });
            });
        },

        lock: function() {
            $('#folder-list').on('click', '.lock-container', function(e) {
                let _this = $(this), 
                    notebookId = $(this).attr('data-id'), 
                    name = $(this).attr('data-name'), 
                    action = $(this).attr('data-action');
                //
                if (action === 'lock') {
                    //
                    if (self.module.data.notebookHasUnlocked(notebookId)) {
                        _this.parent().parent().parent().addClass('is-locked');
                        return false;
                    }
                    let container = self.module.component.module({
                        name: 'Lock notebook',
                        width: 300
                    }, self.view.getView('component', 'lockForm', {
                        id: notebookId,
                        name: name
                    }), '');
                    //
                    container.find('.lock-confirm').off('click').on('click', function() {
                        let noteBookId = $(this).attr('data-id'), 
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
                        self.module.data.lockNotebook(noteBookId, password, function() {
                            _this.parent().parent().parent().addClass('is-locked');
                            container.remove();
                        });
                    });
                } else {
                    let container = self.module.component.module({
                        name: 'Clear lock password',
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
        }
    }
});