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
                Model.set('noteId', noteId);
                //
                $('.notes-item').removeClass('focus');
                $(this).addClass('focus');
            });
        }
    }
});