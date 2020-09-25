/**
 * Page Init
 * Created by onlyfu on 2020/09/16.
 */
App.module.extend('init', function() {
    //
    let self = this;

    this._init = function() {
        // open db
        this.view.display('init', 'prepare', {}, $('#main-container'));
        //
        this.module.data.openDb(function() {
            setTimeout(function() {
                self.module._init();
            }, 1000);
        }, function() {
            self.view.display('init', 'error', {message: 'Failed to open DB.'}, $('.prepare-content'));
        });
    };

    this.init = function() {
        //
        Model.set('showToc', Model.default.showToc).watch('showToc', this.renderToc);
        Model.set('showNoteBook', Model.default.showNoteBook).watch('showNoteBook', this.renderNoteBook);
        Model.set('miniSwitch', false).watch('miniSwitch', this.renderMini);
        //
        this.view.display('init', 'layout', {}, $('#main-container'));
        //
    };

    this.renderMini = function(status) {
        if (status) {
            self.view.append('init', 'mini', {}, $('body'));
        } else {
            $('.folder-mini').remove();
        }
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