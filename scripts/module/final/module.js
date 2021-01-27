/**
 * Final Module
 */
App.module.extend('final', function() {

    let self = this;

    this.init = function() {
        //
        // self.loadLastNote();
        let AESSecret = Model.get('AESSecret');
        self.sendMessage('data', 'getLastNote', {
            AESSecret: AESSecret ? AESSecret : ''
        });
    };

    this.loadLastNote = function() {
        let noteId = localStorage.getItem('lastNoteId');
        if (noteId) {
            Model.set('noteId', noteId);
        }
    }
})