/**
 * Page Init
 * Created by onlyfu on 2020/09/16.
 */
App.module.extend('init', function() {
    //
    let self = this;

    this.init = function() {
        //
        Model.set('showToc', Model.default.showToc).watch('showToc', this.renderToc);
        Model.set('showNoteBook', Model.default.showNoteBook).watch('showNoteBook', this.renderNoteBook);
        //
        this.view.display('init', 'layout', {}, $('#main-container'));
        //
    };

    this.renderToc = function(status) {
        let target = $('#toc');
        if (status) {
            target.show();
        } else {
            target.hide();
        }
    };

    this.renderNoteBook = function(status) {
        let noteBookContainer = $('#folder'), 
            miniContainer = $('.folder-mini');
        //
        if (status) {
            miniContainer.hide();
            noteBookContainer.show();
        } else {
            miniContainer.show();
            noteBookContainer.hide();
        }
    };
});