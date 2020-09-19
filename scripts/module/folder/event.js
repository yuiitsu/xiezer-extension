/**
 * Folder Event
 */
App.event.extend('folder', function() {

    let self = this;

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
                    self.module.data.saveNoteBook(name);
                });
            });
        }
    }
});