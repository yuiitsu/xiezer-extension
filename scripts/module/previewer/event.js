/**
 * Previewer Event
 */
App.event.extend('prviewer', function() {

    let self = this;

    this.event = {
        switchToc: function() {
            $('#previewer-container').on('click', '#toc-switch', function() {
                let showToc = Model.get('showToc');
                Model.set('showToc', !showToc);
                localStorage.setItem('showToc', !showToc);
            });
        },
        scroll: function() {
            //
            $('#previewer-container').on('mouseenter', '.previewer-box', function() {
                Model.set('scrollMaster', 'previewer');
            });
            //
            // $('#previewer-container').on('scroll', '#previewer', function() {
            //     let scrollMaster = Model.get('scrollMaster');
            //     if (scrollMaster !== 'previewer') {
            //         return false;
            //     }
            //     let scrollHeight = $(this).prop('scrollHeight'), 
            //         scrollTop = $(this).prop('scrollTop'), 
            //         clientHeight = $(this).outerHeight();
            //     //
            //     Model.set('editorScrollTop', scrollHeight > 0 && scrollHeight > clientHeight ? scrollTop / (scrollHeight - clientHeight) : 0);
            // });
        },
        toc: function() {
            $('#toc').on('click', '.toc', function(e) {
                let anchor = $(this).attr('data-anchor'), 
                    code = $(this).attr('data-code'),
                    previewerElement = $('.previewer-box'),
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
            $('#previewer-container').on('click', '#copy-html', function() {
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
        },
        exportToWord: function() {
            $('#previewer-container').on('click', '#export-word', function() {
                let currentNote = Model.get('currentNote'), 
                    title = currentNote.title;
                //
                self.module.component.dialog().show('ok', 'Export', self.view.getView('previewer', 'exportTips', {title: title}), function() {
                });
                //
                $('#previewer').wordExport(title);
            });
        },
        previewMode: function() {
            $('#previewer-container').on('click', '.preview-action-preview-mode', function(e) {
                let mode = $(this).attr('data-mode'), 
                    previewOnly = mode === 'edit' ? 'false' : 'true';
                //
                self.module.init.switchPreviewMode(previewOnly);
                e.stopPropagation();
            });
        },
        switchPreviewWith: function() {
            $('#previewer-container').on('click', '.preview-width-item', function(e) {
                let action = $(this).attr('data-action'), 
                    previewWith = Model.get('previewWith');
                //
                if (action === 'minus') {
                    previewWith = previewWith - 25;
                    if (previewWith < 50) {
                        return false;
                    }
                }
                //
                if (action === 'plus') {
                    previewWith = previewWith + 25;
                    if (previewWith > 100) {
                        return false;
                    }
                }
                //
                Model.set('previewWith', previewWith);
                localStorage.setItem('previewWith', previewWith);
                e.stopPropagation();
            });
        }
    }
});