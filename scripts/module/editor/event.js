/**
 * Editor Event
 */
App.event.extend('editor', function() {

    let self = this;

    this.event = {
        titleChange: function() {
            $('.editor-title input').on('input', function() {
                Model.set('title', '# ' + $.trim($(this).val()) + '\n');
            });
        },
        contentChange: function() {
            $('.editor-content').on('input', function() {
                Model.set('content', $.trim($(this).val()));
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