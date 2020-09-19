/**
 * Editor Event
 */
App.event.extend('editor', function() {

    let self = this, 
        inputing = false, 
        timer = null;

    this.autoSave = function() {

    };

    this.event = {
        contentChange: function() {
            $('.editor-content').on('input', function() {
                let content = $.trim($(this).val());
                if (!content) {
                    return false;
                }
                self.module.editor.previewNote(content);
            });
        },
        save: function() {
            $('#editor-save-button').on('click', function() {
                let content = $.trim($('.editor-content').val());
                if (!content) {
                    return false;
                }
                self.module.editor.saveNote(content);
            });
        },
        clickTab: function() {
            $('.editor-content').on('keydown', function(e) {
                if (e.key === 'Tab') {
                    // let el = $(this).get(0), 
                    //     pos = 0;
                    // //
                    // if ('selectionStart' in el) {
                    //     pos = el.selectionStart;
                    // }
                    // console.log(pos);
                    // let currentPosition = pos, 
                    //     content = Model.get('content');
                    // //
                    // content = content.substr(0, currentPosition) + '    ' + content.substr(currentPosition);
                    // Model.set('content', content);
                    return false;
                }
            });
        },
        scroll: function() {

        }
    }
});