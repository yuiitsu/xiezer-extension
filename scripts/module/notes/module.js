/**
 * Notes
 * Created by onlyfu on 2020/09/16.
 */
App.module.extend('notes', function() {
    //
    let self = this;

    this.init = function() {
        //
        this.view.display('notes', 'layout', {}, $('#notes'));
        //
        Model.set('notes', '').watch('notes', this.renderNotes);
    };

    this.renderNotes = function(notes) {
        self.view.display('notes', 'list', notes, $('.notes-items'));
    };
});