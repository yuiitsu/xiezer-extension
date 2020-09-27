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
        editor: function() {
            $('.editor-icon').on('click', function() {
                let action = $(this).attr('data-action'), 
                    container = $('.editor-content'), 
                    containerElement = container[0], 
                    rangeStart = containerElement.selectionStart ,
                    rangeEnd = containerElement.selectionEnd,
                    selectedContent = containerElement.value.substr(rangeStart, rangeEnd - rangeStart),
                    rightOffset = 0, 
                    lines;
                //
                switch (action) {
                    case 'bold':
                        rightOffset = selectedContent ? 6 : 3;
                        selectedContent = ' **' + selectedContent + '** '
                        break;
                    case 'italic':
                        rightOffset = selectedContent ? 4 : 2;
                        selectedContent = ' *' + selectedContent + '* '
                        break;
                    case 'list':
                        lines = selectedContent.split('\n');
                        rightOffset = selectedContent ? lines.length * 3 + 3 : 2;
                        selectedContent = '\n\n';
                        lines.forEach(item => {
                            if (item) {
                                selectedContent += '- ' + item + '\n'
                            }
                        });
                        selectedContent += '\n'
                        break;
                    case 'quote':
                        lines = selectedContent.split('\n');
                        rightOffset = selectedContent ? lines.length * 3 + 2 : 2;
                        selectedContent = '\n\n';
                        lines.forEach(item => {
                            if (item) {
                                selectedContent += '> ' + item + '\n'
                            }
                        });
                        selectedContent += '\n'
                        break;
                    case 'code-slash':
                        rightOffset = selectedContent ? 12 : 5;
                        selectedContent = '\n\n```\n' + selectedContent + '\n```\n\n'
                        break;
                }
                //
                let scrollTop = container.scrollTop();
                //
                var contentPrev = containerElement.value.substring(0, rangeStart);
                var contentNext = containerElement.value.substring(rangeEnd);
                container.val(contentPrev + selectedContent + contentNext);
                container.focus();
                console.log(rangeEnd, rightOffset);
                containerElement.setSelectionRange(rangeEnd + rightOffset, rangeEnd + rightOffset);
                //
                container.scrollTop(scrollTop);
                //
                container.trigger('change');
            });
        },
        contentChange: function() {
            $('.editor-content').on('change input', function(e) {
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
                    self.module.editor.previewNote(content);
                    //
                    self.autoSave();
                    return false;
                }
            });
        },
        save: function() {
            $('#editor-save-button').on('click', function() {
                if ($(this).hasClass('disabled')) {
                    return false;
                }
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
        },
        copy: function() {
            $('#copy-source').on('click', function() {
                if ($(this).hasClass('disabled')) {
                    return false;
                }
                let target = $('.editor-content');
                target.select();
                document.execCommand('copy');
                self.module.component.notification('Copy successfully.');
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