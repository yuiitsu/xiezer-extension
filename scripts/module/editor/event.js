/**
 * Editor Event
 */
App.event.extend('editor', function() {

    let self = this, 
        autoSaveTimer = null; 

    this.autoSave = function() {
        if (autoSaveTimer) {
            self.log('clear auto save timer');
            clearTimeout(autoSaveTimer);
        }
        self.log('set auto save timer');
        autoSaveTimer = setTimeout(function() {
            self.save();
        }, 2000);
    };

    this.save = function() {
        //
        let content = $.trim($('.editor-content').val());
        if (!content) {
            return false;
        }
        self.module.editor.saveNote(content);
        self.log('auto save: ', content);
        Model.set('editorAutoSaved', self.module.component.timeToStr());
    };

    this.clearTimer = function() {
        self.log('clearTimer');
        clearTimeout(autoSaveTimer);
    };

    this.event = {
        focusOnEditor: function() {
            $('.editor-content').focus();
        },
        contentChange: function() {
            $('.editor-content').on('input', function(e) {
                let content = $(this).val();
                if (!content) {
                    return false;
                }
                self.module.editor.previewNote(content);
                //
                self.autoSave();
            });

            $('.editor-content').on('keydown', function(e) {
                if (e.keyCode === 13) {
                    //
                    let el = $(this).get(0), 
                        currentPosition = el.selectionStart, 
                        content = $(this).val();
                    //
                    content = content.substr(0, currentPosition) + '\n' + content.substr(currentPosition);
                    $(this).val(content);
                    el.focus();
                    el.setSelectionRange(currentPosition + 1, currentPosition + 1);
                    //
                    self.autoSave();
                    return false;
                }
            });
        },
        save: function() {
            $('#editor-save-button').on('click', function() {
                self.save();
            });
        },
        scroll: function() {
            //
            $('.editor-content').mouseenter(function() {
                Model.set('scrollMaster', 'editor');
            });
            //
            $('.editor-content').scroll(function() {
                let scrollMaster = Model.get('scrollMaster');
                if (scrollMaster !== 'editor') {
                    return false;
                }
                let scrollHeight = $(this).prop('scrollHeight'), 
                    scrollTop = $(this).prop('scrollTop'), 
                    clientHeight = $(this).outerHeight();
                //
                Model.set('previewerScrollTop', scrollHeight > 0 && scrollHeight > clientHeight ? scrollTop / (scrollHeight - clientHeight) : 0);
            });
        }
        // clickTab: function() {
        //     $('.editor-content').on('keydown', function(e) {
        //         if (e.key === 'Tab') {
        //             // let el = $(this).get(0), 
        //             //     pos = 0;
        //             // //
        //             // if ('selectionStart' in el) {
        //             //     pos = el.selectionStart;
        //             // }
        //             // console.log(pos);
        //             // let currentPosition = pos, 
        //             //     content = Model.get('content');
        //             // //
        //             // content = content.substr(0, currentPosition) + '    ' + content.substr(currentPosition);
        //             // Model.set('content', content);
        //             return false;
        //         }
        //     });
        // },
        // scroll: function() {

        // }
    }
});