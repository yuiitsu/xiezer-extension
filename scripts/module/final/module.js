/**
 * Final Module
 */
App.module.extend('final', function() {

    let self = this;

    this.init = function() {
        //
        this.module.data.readAllNoteBooks(function() {
            self.module.data.readAllNotes();
            self.loadLastNote();
        });
    };

    this.loadLastNote = function() {
        let noteId = localStorage.getItem('lastNoteId');
        if (noteId) {
            Model.set('noteId', noteId);
        }
    }
})