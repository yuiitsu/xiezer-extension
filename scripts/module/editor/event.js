/**
 * Editor Event
 */
App.event.extend('editor', function() {

    let self = this;

    this.event = {
        titleChange: function() {
            $('.editor-title').on('input', function() {
                Model.set('title', '# ' + $.trim($(this).text()) + '\n');
            });
        },
        contentChange: function() {
            $('.editor-content').on('input', function() {
                Model.set('content', $.trim($(this).val()));
            });
        }
    }
});