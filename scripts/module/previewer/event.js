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
        },
        toc: function() {
            $('#toc').on('click', '.toc', function(e) {
                let anchor = $(this).attr('data-anchor'), 
                    code = $(this).attr('data-code'),
                    previewerElement = $('#previewer'),
                    scrollTop = previewerElement.prop('scrollTop'),
                    target = previewerElement.find('#' + anchor), 
                    targetTop = target.position().top, 
                    targetHeight = target.outerHeight(), 
                    p = (parseInt(code) - 1) * 20;
                //
                previewerElement.animate({scrollTop: targetTop - targetHeight + scrollTop - p}, 100);
                //
                e.stopPropagation();
            });
        },
        copy: function() {
            $('#copy-html').on('click', function() {
                if ($(this).hasClass('disabled')) {
                    return false;
                }
                var div = document.getElementById('previewer');
                var selection = window.getSelection();
                var range = document.createRange();
                range.selectNodeContents(div);
                selection.removeAllRanges();
                selection.addRange(range);
                document.execCommand("Copy");
                self.module.component.notification('Copy successfully.');
            });
        }
    }
});