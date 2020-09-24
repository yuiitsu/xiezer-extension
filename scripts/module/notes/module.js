/**
 * Notes
 * Created by onlyfu on 2020/09/16.
 */
App.module.extend('notes', function() {
    //
    let self = this;

    this.init = function() {
        //
        this.view.display('notes', 'layout', {notesOrder: Model.get('notesOrder')}, $('#notes'));
        //
        Model.set('notes', '').watch('notes', this.renderNotes);
        Model.set('isNotesEditMode', false).watch('isNotesEditMode', this.renderNotes);
        Model.set('notesChecked', []).watch('notesChecked', this.renderNotes);
        Model.watch('notesOrder', this.renderOrderIcon);
    };

    this.renderNotes = function() {
        let notes = Model.get('notes'), 
            selectedNoteId = Model.get('noteId'), 
            isNotesEditMode = Model.get('isNotesEditMode'),
            notesChecked = Model.get('notesChecked');
        //
        self.view.display('notes', 'list', {
            list: notes, 
            selectedNoteId: selectedNoteId, 
            notesChecked: notesChecked,
            isNotesEditMode: isNotesEditMode
        }, $('.notes-items'));
    };

    this.renderOrderIcon = function(order) {
        self.view.display('notes', 'order_' + order, {}, $('#notes-order'));
    };

    this.showMoveToNoteBook = function() {
        self.module.component.module('Select Notebook', self.module.folder.getSelectorView(), '');
    };
});