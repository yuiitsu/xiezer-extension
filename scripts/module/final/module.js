/**
 * Final Module
 */
App.module.extend('final', function() {

    let self = this;

    this.init = function() {
        //
        // self.loadLastNote();
        self.sendMessage('data', 'getLastNote');
    };

    this.loadLastNote = function() {
        let noteId = localStorage.getItem('lastNoteId');
        if (noteId) {
            Model.set('noteId', noteId);
        }
    }
})