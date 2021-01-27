/**
 * Previewer
 * Created by onlyfu on 2020/09/16.
 */
App.module.extend('previewer', function() {
    //
    let self = this, 
        previewerTimer = null, 
        editorModifyLastTime = 0;

    this.init = function() {
        //
        let previewWith = localStorage.getItem('previewWith');
        previewWith = previewWith ? parseInt(previewWith) : 75;
        //
        this.md = window.markdownit();
        //
        // Model.set('editorModifyTime', new Date().getTime());
        Model.set('content', '').watch('content', this.renderContent);
        // Model.set('content', '').watch('content', this.renderPreview);
        Model.set('toc', '').watch('toc', this.renderToc);
        Model.watch('showToc', this.renderTocIcon);
        Model.set('previewerScrollTop', 0).watch('previewerScrollTop', this.renderScrollTop);
        Model.watch('previewOnly', this.renderPreviewMode);
        Model.set('previewWith', previewWith).watch('previewWith', this.renderPreviewMode);
        Model.set('previewerScrollTop', 0).watch('previewerScrollTop', this.renderScrollTop);
        //
        this.renderLayout();
    };

    this.renderLayout = function() {
        let previewOnly = Model.get('previewOnly'), 
            previewWith = Model.get('previewWith');
        //
        this.view.display('previewer', 'layout', {previewOnly: previewOnly, width: previewWith}, $('#previewer-container'));
        let showToc = localStorage.getItem('showToc');
        Model.set('showToc', showToc === 'true');
        //
        $('.previewer-box').scroll(function() {
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
    };

    this.renderContent = function(result) {
        //
        let container = $('#previewer'),
            content = typeof result === 'string' ? result : result.content;
        //
        console.log(result);
        if (content) {
            Model.set('currentNote', result);
            // container.html(marked(content));
            container.html(self.md.render(content));
            //
            container.find('a').each(function() {
                $(this).attr('target', '_blank');
            });
            //
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightBlock(block);
            });
            //
            // container.scrollTop(0);
        } else {
            self.view.display('previewer', 'empty', {}, container);
        }
        //
        Model.set('toc', new Date().getTime());
        Model.set('notesOpened', true);
    };

    this.renderPreviewMode = function(v) {
        self.renderLayout();
        // Model.set('content', Model.get('content'));
        self.sendMessage('data', 'reloadNote', {
            status: v,
            AESSecret: Model.get('AESSecret')
        });
    };

    this.renderToc = function() {
        let toc = [], 
            n = 1;
        $('#previewer').find('h1, h2, h3, h4, h5, h6').each(function() {
            let element = $(this)[0], 
                nodeName = element.nodeName,
                anchor = nodeName + '-' + n, 
                anchorNodeCode = nodeName.replace('H', '');
            //
            $(this).attr('id', anchor);
            toc.push({
                type: $(this)[0].nodeName,
                title: self.module.component.encodeHtml($(this).text()),
                anchor: anchor,
                code: anchorNodeCode
            });
            n++;
        });
        //
        self.view.display('previewer', 'toc', {list: toc}, $('#toc'));
    };

    this.renderTocIcon = function(status) {
        let target = $('#toc-switch'), 
            container = $('.toc-container');
        //
        if (status) {
            target.addClass('focus');
            container.show();
        } else {
            target.removeClass('focus');
            container.hide();
        }
    };

    this.renderScrollTop = function(percent) {
        let target = $('.previewer-box'), 
            scrollHeight = target.prop('scrollHeight'), 
            clientHeight = target.outerHeight(),
            scrollTop = (scrollHeight - clientHeight) * percent;
        //
        target.animate({scrollTop: scrollTop}, 0);
    };
});