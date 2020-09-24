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
                let scrollHeight = $(this).prop('scrollHeight'), 
                    scrollTop = $(this).prop('scrollTop'), 
                    clientHeight = $(this).outerHeight();
                //
                Model.set('editorScrollTop', scrollHeight > 0 && scrollHeight > clientHeight ? scrollTop / (scrollHeight - clientHeight) : 0);
            });
        }
    }
});