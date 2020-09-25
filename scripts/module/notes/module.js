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
        Model.set('isEditMode', false).watch('isEditMode', this.renderNotes);
        Model.set('isSearchMode', false).watch('isSearchMode', this.renderNotes);
        Model.set('notesChecked', []).watch('notesChecked', this.renderNotes);
        Model.watch('notesOrder', this.renderOrderIcon);
        Model.watch('isEditMode', this.renderEditIcon);
        Model.watch('isSearchMode', this.renderSearchIcon);
        //
        Model.set('isSearchMode', true);
        //
        this.module.data.readAllNotes();
    };

    this.renderNotes = function() {
        let notes = Model.get('notes'), 
            selectedNoteId = Model.get('noteId'), 
            isEditMode = Model.get('isEditMode'),
            isSearchMode = Model.get('isSearchMode'),
            notesChecked = Model.get('notesChecked'), 
            searchKey = Model.get('searchKey');
        //
        self.view.display('notes', 'list', {
            list: notes, 
            selectedNoteId: selectedNoteId, 
            notesChecked: notesChecked,
            isEditMode: isEditMode,
            isSearchMode: isSearchMode,
            searchKey: searchKey
        }, $('.notes-items'));
        //
        $('#notes-count').text(notes.length);
    };

    this.renderActionMode = function(action) {
        $('.notes-header-action').removeClass('focus');
        if (action) {
            let target = $('#notes-header-action-' + action);
            target.addClass('focus');
        }
    };

    this.renderEditIcon = function(status) {
        let target = $('#notes-header-action-edit');
        if (status) {
            target.addClass('focus');
        } else {
            target.removeClass('focus');
        }
    };

    this.renderSearchIcon = function(status) {
        let target = $('#notes-header-action-search');
        if (status) {
            target.addClass('focus');
        } else {
            target.removeClass('focus');
        }
    };

    this.renderOrderIcon = function(order) {
        self.view.display('notes', 'order_' + order, {}, $('#notes-order'));
    };

    this.showMoveToNoteBook = function() {
        self.module.component.module('Select Notebook', self.module.folder.getSelectorView(), '');
    };
});