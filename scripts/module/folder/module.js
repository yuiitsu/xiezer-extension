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
        //
        this.module.data.readAllNoteBooks();
    };

    this.renderNotebooks = function(notes) {
        let selectedNoteBookId = Model.get('noteBookId');
        self.view.display('folder', 'list', {
            list: notes, 
            selectedNoteBookId: selectedNoteBookId
        }, $('#folder-list'));
    };

    this.getSelectorView = function() {
        let noteBooks = Model.get('notebooks');
        return self.view.getView('folder', 'selector', noteBooks);
    };
});