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
        Model.set('isEditMode', false).watch('isEditMode', this.renderEditMode);
        // Model.set('isSearchMode', false).watch('isSearchMode', this.renderNotes);
        Model.set('notesChecked', []).watch('notesChecked', this.renderEditLine);
        Model.watch('notesOrder', this.renderOrderIcon);
        Model.watch('isEditMode', this.renderEditIcon);
        Model.watch('isSearchMode', this.renderSearchIcon);
        //
        // Model.set('isSearchMode', true);
        //
        // this.module.data.readAllNotes();
    };

    this.renderNotes = function() {
        let notes = Model.get('notes'), 
            selectedNoteId = Model.get('noteId'), 
            isEditMode = Model.get('isEditMode'),
            isSearchMode = Model.get('isSearchMode'),
            notesChecked = Model.get('notesChecked'), 
            searchKey = Model.get('searchKey'), 
            scrollTop = Model.get('notesScrollTop');
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
        $('.notes-items-container').scrollTop(scrollTop ? scrollTop : 0);
        Model.set('notesScrollTop', 0);
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

    this.showMoveToNoteBook = function(noteId) {
        let view = self.module.folder.getSelectorView(), 
            actionView = self.view.getView('notes', 'moveToNotebook', {noteId: noteId ? noteId : ''});
        //
        self.module.component.module({
            name: 'Select Notebook',
            width: 300
        }, view + actionView, '');
        //
    };

    this.renderEditMode = function(status) {
        let target = $('.notes-items');
        if (status) {
            target.addClass('notes-edit-mode');
        } else {
            target.removeClass('notes-edit-mode');
        }
    };

    this.renderEditLine = function(notesChecked) {
        let target = $('.notes-edit-line');
        if (notesChecked.length > 0) {
            target.addClass('is-selected');
        } else {
            target.removeClass('is-selected');
        }
    };
});