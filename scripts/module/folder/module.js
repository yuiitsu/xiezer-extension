/**
 * Folder
 * Created by onlyfu on 2020/09/16.
 */
App.module.extend('folder', function() {
    //
    let self = this;

    this.init = function() {
        //
        this.view.display('folder', 'layout', {}, $('#folder'));
        //
        Model.set('notebooks', '').watch('notebooks', this.renderNotebooks);
    };

    this.renderNotebooks = function(notes) {
        let selectedNoteBookId = Model.get('noteBookId');
        self.view.display('folder', 'list', {
            list: notes, 
            selectedNoteBookId: selectedNoteBookId
        }, $('#folder-list'));
    };

    this.checkLockResult = function(result) {
        let allNotesElement = $('.all-notes'),
            status = result.status,
            noteBookId = result.noteBookId,
            container = $(Model.get('currentModuleComponent')),
            _this = $(Model.get('clickNotebookElement'));

        if (status) {
            Model.set('noteBookId', noteBookId);
            _this.parent().removeClass('is-locked');
            container.remove();
            //
            $('.folder-child').removeClass('focus');
            _this.parent().addClass('focus');
            allNotesElement.removeClass('focus');
        } else {
            self.module.component.dialog().ok('Unlock failed. Password error.', 'Unlock note', function() {
                let target = container.find('#password');
                target.focus();
                target.select();
            });
        }
    };

    this.lock = function(result) {
        let _this = $(Model.get('currentNotebookLock')),
            status = result.status,
            notebookId = result.notebookId;
        //
        if (status) {
            _this.parent().parent().parent().addClass('is-locked');
        } else {
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
        }
    }

    this.lockResult = function(status) {
        let _this = $(Model.get('currentNotebookLock')),
            container = $(Model.get('currentModuleComponent'));
        //
        if (status) {
            self.module.component.notification('Lock successfully.')
            _this.parent().parent().parent().addClass('is-locked');
            container.remove();
        } else {
            self.module.component.notification('Lock failed.', 'danger')
        }
    };

    this.clearLockResult = function(status) {
        let _this = $(Model.get('currentNotebookLock')),
            container = $(Model.get('currentModuleComponent'));
        //
        if (status) {
            self.module.component.notification('Lock successfully.')
            _this.parent().parent().parent().removeClass('is-locked');
            container.remove();
        } else {
            self.module.component.notification('Lock failed.', 'danger')
        }
    };

    this.updateNotebookResult = function(status) {
        console.log(`updateNotebookResult: ${status}`);
    }

    this.saveNotebookResult = function(status) {
        console.log(`saveNotebookResult: ${status}`);
    }

    this.getSelectorView = function(notebooks) {
        return self.view.getView('folder', 'selector', notebooks);
    };
});