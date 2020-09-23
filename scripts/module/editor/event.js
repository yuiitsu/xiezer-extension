/**
 * Editor Event
 */
App.event.extend('editor', function() {

    let self = this, 
        timer = null;

    this.autoSave = function() {
        if (timer) {
            self.log('clear auto save timer');
            clearTimeout(timer);
        }
        self.log('set auto save timer');
        timer = setTimeout(function() {
            self.save();
        }, 2000);
    };

    this.save = function() {
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
        clearTimeout(timer);
    };

    this.event = {
        contentChange: function() {
            $('.editor-content').on('input', function() {
                let content = $.trim($(this).val());
                if (!content) {
                    return false;
                }
                self.module.editor.previewNote(content);
                //
                self.autoSave();
            });
        },
        save: function() {
            $('#editor-save-button').on('click', function() {
                self.save();
            });
        },
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