/**
 * Init Event
 */
App.event.extend('initEvent', function() {

    let self = this, 
        host = 'https://www.oneheart.ink';

    this.event = {
        usage: function() {
            $('body').on('click', '.usage-link', function(e) {
                let url = $(this).attr('data-url');
                window.open(host + url, "_blank");
                e.stopPropagation();
            });
        },
        switchPreviewMode: function() {
            $(document).on('keydown', function(e) {
                if (e.altKey && e.keyCode === 69) {
                    self.module.init.switchPreviewMode();
                    e.stopPropagation();
                    return false;
                }
            });
        }
    }
});