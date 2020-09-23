/**
 * Previewer Event
 */
App.event.extend('prviewer', function() {

    let self = this;

    this.event = {
        switchToc: function() {
            $('#toc-switch').on('click', function() {
                let showToc = Model.get('showToc');
                Model.set('showToc', !showToc);
                localStorage.setItem('showToc', !showToc);
            });
        },
        scroll: function() {
            //
            $('#previewer').mouseenter(function() {
                Model.set('scrollMaster', 'previewer');
            });
            //
            $('#previewer').scroll(function() {
                let scrollMaster = Model.get('scrollMaster');
                if (scrollMaster !== 'previewer') {
                    return false;
                }
                console.log($(this).prop('scrollHeight'), $(this).prop('scrollTop'));
                let scrollHeight = $(this).prop('scrollHeight'), 
                    scrollTop = $(this).prop('scrollTop');
                //
                Model.set('editorScrollTop', scrollHeight > 0 ? scrollTop / scrollHeight : 0);
            });
        }
    }
});