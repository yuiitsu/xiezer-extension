/**
 * CES Content Event
 * Created by Yuiitsu on 2018/10/24.
 */
App.event.extend('content', function() {

    let self = this;

    this.event = {
        closeTranslationMode: function() {
            $('html').on('click', '.xiezer-header-x', function() {
                self.module.content.closeReaderMode();
            })
        }
    }
});
