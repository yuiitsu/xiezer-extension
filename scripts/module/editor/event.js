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
        console.log('auto save: ', content);
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
            //
            let b = {
                h: function(selectedContent, rightOffset, container, containerElement, rangeStart, rangeEnd, content, v) {
                    let preContent = content.substr(0, rangeStart), 
                        symbol = [],
                        lines = preContent.split('\n'), 
                        linesLen = lines.length, 
                        currentLine = lines[linesLen - 1], 
                        currentLineLen = currentLine.length, 
                        currentLineStart = rangeStart - currentLineLen;
                    //
                    for (let i = 0; i < v; i++) {
                        symbol.push('#');
                    }
                    selectedContent = symbol.join('') + ' ' + currentLine;
                    return [selectedContent, v + 1, currentLineStart];
                },
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
                    rightOffset = selectedContent ? lines.length * 3 + 2 : 2;
                    selectedContent = '\n';
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
                },
                link: function(selectedContent, rightOffset, container, containerElement, rangeStart, rangeEnd) {
                    //
                    let module = self.module.component.module({
                        name: 'Link',
                        width: 300,
                    }, self.view.getView('editor', 'linkForm', {text: selectedContent}), '');
                    //
                    let p = function() {
                        let title = $.trim(module.find('input[name="title"]').val()), 
                            url = $.trim(module.find('input[name="url"]').val()), 
                            replaceLink = '['+ title +']('+ url +')';
                        //
                        rightOffset = replaceLink.length - selectedContent.length;
                        d(container, containerElement, rangeStart, rangeEnd, replaceLink, rightOffset);
                        module.remove();
                    };
                    //
                    module.find('input[name="title"]').focus();
                    module.find('input[name="title"]').on('keydown', function(e) {
                        if (e.keyCode === 13) {
                            p();
                            return false;
                        }
                    });
                    module.find('.form-confirm').on('click', function() {
                        p();
                    });
                    //
                    module.find('.form-cancel').on('click', function() {
                        module.remove();
                    });
                },
                blankUp: function(selectedContent, rightOffset, container, containerElement, rangeStart, rangeEnd, content, v) {
                    let preContent = content.substr(0, rangeStart), 
                        lines = preContent.split('\n'), 
                        linesLen = lines.length, 
                        currentLine = lines[linesLen - 1], 
                        currentLineLen = currentLine.length, 
                        currentLineStart = rangeStart - currentLineLen;
                    //
                    selectedContent = '\n' + currentLine;
                    return [selectedContent, 1, currentLineStart];
                },
                blankDown: function(selectedContent, rightOffset, container, containerElement, rangeStart, rangeEnd, content, v) {
                    let text = content.substr(rangeStart), 
                        lines = text.split('\n'), 
                        // linesLen = lines.length, 
                        currentLine = lines[0], 
                        currentLineLen = currentLine.length, 
                        currentLineStart = rangeStart + currentLineLen;
                    //
                    selectedContent = '\n';
                    return [selectedContent, 1, currentLineStart, currentLineStart];
                },
                duplicate: function(selectedContent, rightOffset, container, containerElement, rangeStart, rangeEnd, content, v) {
                    let preText = content.substr(0, rangeStart), 
                        nextText = content.substr(rangeStart),
                        preLines = preText.split('\n'), 
                        preLinesLen = preLines.length, 
                        currentLinePreText = preLines[preLinesLen - 1], 
                        nextLines = nextText.split('\n'),
                        currentLineNextText = nextLines[0],
                        currentLineText = currentLinePreText + currentLineNextText,
                        currentLineNextTextLen = currentLineNextText.length, 
                        nextLineStart = rangeStart + currentLineNextTextLen;
                    //
                    selectedContent = '\n' + currentLineText;
                    return [selectedContent, currentLineText.length + 1, nextLineStart, nextLineStart];
                },
                delLine: function(selectedContent, rightOffset, container, containerElement, rangeStart, rangeEnd, content, v) {
                    let preText = content.substr(0, rangeStart), 
                        nextText = content.substr(rangeStart),
                        preLines = preText.split('\n'), 
                        preLinesLen = preLines.length, 
                        currentLinePreText = preLines[preLinesLen - 1], 
                        nextLines = nextText.split('\n'),
                        currentLineNextText = nextLines[0],
                        currentLineText = currentLinePreText + currentLineNextText, 
                        currentLineTextLen = currentLineText.length;
                    //
                    rangeStart = rangeStart - currentLinePreText.length;
                    rangeEnd = rangeStart + currentLineTextLen;
                    return ['', -currentLineTextLen - 1, rangeStart - 1, rangeEnd];
                },
                horizontal: function(selectedContent, rightOffset, container, containerElement, rangeStart, rangeEnd, content, v) {
                    let preText = content.substr(0, rangeStart), 
                        nextText = content.substr(rangeStart),
                        preLines = preText.split('\n'), 
                        preLinesLen = preLines.length, 
                        currentLinePreText = preLines[preLinesLen - 1], 
                        nextLines = nextText.split('\n'),
                        currentLineNextText = nextLines[0],
                        currentLineText = currentLinePreText + currentLineNextText,
                        currentLineNextTextLen = currentLineNextText.length, 
                        nextLineStart = rangeStart + currentLineNextTextLen;
                    //
                    selectedContent = '\n\n***\n';
                    return [selectedContent, 5, nextLineStart, nextLineStart];
                }
            };
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
                let r = b[action](selectedContent, rightOffset, container, containerElement, rangeStart, rangeEnd);
                if (r) {
                    selectedContent = r[0];
                    rightOffset = r[1];
                    //
                    d(container, containerElement, rangeStart, rangeEnd, selectedContent, rightOffset);
                }
            });
            //
            let target = $('.editor-content');
            target.on('keydown', function(e) {
                let container = $(this), 
                    containerElement = container[0], 
                    rangeStart = containerElement.selectionStart ,
                    rangeEnd = containerElement.selectionEnd,
                    selectedContent = containerElement.value.substr(rangeStart, rangeEnd - rangeStart),
                    rightOffset = 0, 
                    content = container.val(),
                    k = '', 
                    v = 0;
                //
                console.log(rangeStart, rangeEnd, selectedContent);
                Model.set('editorRange', {
                    rangeStart: rangeStart,
                    rangeEnd: rangeEnd,
                    selectedContent: selectedContent
                });
                //
                if (e.key === 'Tab') {
                    content = content.substr(0, rangeStart) + '\t' + content.substr(rangeStart);
                    container.val(content);
                    containerElement.focus();
                    containerElement.setSelectionRange(rangeStart + 1, rangeStart + 1);
                    self.module.editor.previewNote(content);
                    self.autoSave();
                    return false;
                }
                //
                console.log(e.keyCode);
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
                if (e.altKey && e.keyCode === 76) {
                    console.log('option + l');
                    k = 'link';
                }
                if (e.altKey && e.keyCode === 49) {
                    console.log('option + 1');
                    k = 'h';
                    v = 1;
                }
                if (e.altKey && e.keyCode === 50) {
                    console.log('option + 2');
                    k = 'h';
                    v = 2;
                }
                if (e.altKey && e.keyCode === 51) {
                    console.log('option + 3');
                    k = 'h';
                    v = 3;
                }
                if (e.altKey && e.keyCode === 52) {
                    console.log('option + 4');
                    k = 'h';
                    v = 4;
                }
                if (e.altKey && e.keyCode === 53) {
                    console.log('option + 5');
                    k = 'h';
                    v = 5;
                }
                if (e.altKey && e.keyCode === 54) {
                    console.log('option + 6');
                    k = 'h';
                    v = 6;
                }
                if (e.altKey && e.keyCode === 38) {
                    console.log('option + up');
                    k = 'blankUp';
                }
                if (e.altKey && e.keyCode === 40) {
                    console.log('option + down');
                    k = 'blankDown';
                }
                if (e.altKey && e.keyCode === 68) {
                    console.log('option + d');
                    k = 'duplicate';
                }
                if (e.altKey && e.keyCode === 8) {
                    console.log('option + backspace');
                    k = 'delLine';
                }
                if (e.altKey && e.keyCode === 72) {
                    console.log('option + h');
                    k = 'horizontal';
                } 
                //
                if (k) {
                    let r = b[k](selectedContent, rightOffset, container, containerElement, rangeStart, rangeEnd, content, v);
                    if (r) {
                        selectedContent = r[0];
                        rightOffset = r[1];
                        if (r[2]) {
                            rangeStart = r[2];
                        }
                        if (r[3] !== undefined) {
                            rangeEnd = r[3];
                        }
                        //
                        d(container, containerElement, rangeStart, rangeEnd, selectedContent, rightOffset);
                    }
                    return false;
                }
                //
                if (e.keyCode === 13) {
                    //
                    content = content.substr(0, rangeStart) + '\n' + content.substr(rangeStart);
                    container.val(content);
                    containerElement.focus();
                    containerElement.setSelectionRange(rangeStart + 1, rangeStart + 1);
                    //
                    self.module.editor.previewNote(content);
                    //
                    self.autoSave();
                    //
                    let scrollHeight = container.prop('scrollHeight'), 
                        scrollTop = container.prop('scrollTop'), 
                        clientHeight = container.outerHeight();
                    if (scrollTop + clientHeight + 50 >= scrollHeight) {
                        container.scrollTop(scrollHeight);
                    }
                    return false;
                }
            });
            //
            target.on('click', function(e) {
                let container = $(this), 
                    containerElement = container[0], 
                    rangeStart = containerElement.selectionStart ,
                    rangeEnd = containerElement.selectionEnd,
                    selectedContent = containerElement.value.substr(rangeStart, rangeEnd - rangeStart);
                console.log(rangeStart, rangeEnd, selectedContent);
                Model.set('editorRange', {
                    rangeStart: rangeStart,
                    rangeEnd: rangeEnd,
                    selectedContent: selectedContent
                });
            });
        },
        contentChange: function() {
            let cpLock = false, target = $('.editor-content');
            target.on('compositionstart', function() {
                cpLock = true;
            });
            target.on('compositionend', function() {
                cpLock = false;
            });
            //
            target.on('input', function(e) {
                let _this = $(this);
                setTimeout(function() {
                    if (!cpLock) {
                        let content = _this.val();
                        if (!content) {
                            return false;
                        }
                        self.module.editor.previewNote(content);
                        self.autoSave();
                    }
                });
            });
            target.on('change', function(e) {
                let content = $(this).val();
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
                if ($(this).hasClass('disabled')) {
                    return false;
                }
                self.save();
            });
        },
        scroll: function() {
            //
            let target = $('.editor-content');
            target.mouseenter(function() {
                Model.set('scrollMaster', 'editor');
            });
            //
            target.scroll(function() {
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
                console.log(event.clipboardData.getData('text/html'))
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
        },
        goAESEntrance: function() {
            $('.editor-entity').on('click', '.editor-go-aes-key', function(e) {
                Model.set('AESSecret', '');
                self.module.init._init();
                e.stopPropagation();
            });
        }
    }
});