/**
 * Init Event
 */
App.event.extend('initEvent', function() {

    let self = this, 
        host = 'https://www.xiezer.com';

    this.event = {
        usage: function() {
            $('body').on('click', '.usage-link', function(e) {
                let url = $(this).attr('data-url');
                window.open(host + url, "_blank");
                e.stopPropagation();
            });
        }
    }
});