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
        Model.set('editorAutoSaved', '');
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
            let b = {
                bold: function(selectedContent, rightOffset) {
                    rightOffset = selectedContent ? 6 : 3;
                    selectedContent = ' **' + selectedContent + '** ';
                    return [selectedContent, rightOffset];
                },
                italic: function(selectedContent, rightOffset) {
                    rightOffset = selectedContent ? 4 : 2;
                    selectedContent = ' *' + selectedContent + '* '
                    return [selectedContent, rightOffset];
                },
                list: function(selectedContent, rightOffset) {
                    let lines = selectedContent.split('\n');
                    rightOffset = selectedContent ? lines.length * 3 + 3 : 2;
                    selectedContent = '\n\n';
                    lines.forEach(item => {
                        if (item) {
                            selectedContent += '- ' + item + '\n';
                        }
                    });
                    selectedContent += '\n';
                    return [selectedContent, rightOffset];
                },
                quote: function(selectedContent, rightOffset) {
                    let lines = selectedContent.split('\n');
                    rightOffset = selectedContent ? lines.length * 3 + 2 : 2;
                    selectedContent = '\n\n';
                    lines.forEach(item => {
                        if (item) {
                            selectedContent += '> ' + item + '\n';
                        }
                    });
                    selectedContent += '\n';
                    return [selectedContent, rightOffset];
                },
                'code-slash': function(selectedContent, rightOffset) {
                    rightOffset = selectedContent ? 12 : 5;
                    selectedContent = '\n\n```\n' + selectedContent + '\n```\n\n';
                    return [selectedContent, rightOffset];
                }
            };
            //
            let d = function(container, containerElement, rangeStart, rangeEnd, selectedContent, rightOffset) {
                //
                let scrollTop = container.scrollTop();
                //
                var contentPrev = containerElement.value.substring(0, rangeStart);
                var contentNext = containerElement.value.substring(rangeEnd);
                container.val(contentPrev + selectedContent + contentNext);
                container.focus();
                containerElement.setSelectionRange(rangeEnd + rightOffset, rangeEnd + rightOffset);
                //
                container.scrollTop(scrollTop);
                //
                container.trigger('change');
            }
            $('.editor-content').on('blur', function() {
                let container = $('.editor-content'), 
                    containerElement = container[0], 
                    rangeStart = containerElement.selectionStart ,
                    rangeEnd = containerElement.selectionEnd,
                    selectedContent = containerElement.value.substr(rangeStart, rangeEnd - rangeStart);
                // console.log(rangeStart, rangeEnd, selectedContent);
                Model.set('editorRange', {
                    rangeStart: rangeStart,
                    rangeEnd: rangeEnd,
                    selectedContent: selectedContent
                });
            });
            //
            $('.editor-icon').on('click', function() {
                let action = $(this).attr('data-action'), 
                    container = $('.editor-content'), 
                    containerElement = container[0], 
                    rangeStart = containerElement.selectionStart ,
                    rangeEnd = containerElement.selectionEnd,
                    selectedContent = containerElement.value.substr(rangeStart, rangeEnd - rangeStart),
                    rightOffset = 0;
                //
                r = b[action](selectedContent, rightOffset);
                selectedContent = r[0];
                rightOffset = r[1];
                //
                d(container, containerElement, rangeStart, rangeEnd, selectedContent, rightOffset);
            });
            //
            $('.editor-content').on('keydown', function(e) {
                let container = $('.editor-content'), 
                    containerElement = container[0], 
                    rangeStart = containerElement.selectionStart ,
                    rangeEnd = containerElement.selectionEnd,
                    selectedContent = containerElement.value.substr(rangeStart, rangeEnd - rangeStart),
                    rightOffset = 0, 
                    k = '';
                //
                if (e.altKey && e.keyCode === 66) {
                    console.log('option + b');
                    k = 'bold';
                }
                if (e.altKey && e.keyCode === 73) {
                    console.log('option + i');
                    k = 'italic';   
                }
                if (e.altKey && e.keyCode === 85) {
                    console.log('option + u');
                    k = 'list';   
                }
                if (e.altKey && e.keyCode === 81) {
                    console.log('option + q');
                    k = 'quote';   
                }
                if (e.altKey && e.keyCode === 67) {
                    console.log('option + c');
                    k = 'code-slash';   
                }
                //
                if (k) {
                    r = b[k](selectedContent, rightOffset);
                    selectedContent = r[0];
                    rightOffset = r[1];
                    //
                    d(container, containerElement, rangeStart, rangeEnd, selectedContent, rightOffset);
                    return false;
                }
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
        },
        images: function() {
            $('#images').on('click', function() {
                self.module.images.show();
            });
        },
        paste: function() {
            document.getElementById('editor-content').addEventListener('paste', function (event) {
                var items = event.clipboardData && event.clipboardData.items;
                var file = null;
                if (items && items.length) {
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].type.indexOf('image') !== -1) {
                            file = items[i].getAsFile();
                            break;
                        }
                    }
                }
                console.log(file);
                if (file) {
                    self.module.images.renderMiniUpload(file);
                }
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