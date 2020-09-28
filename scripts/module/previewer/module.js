/**
 * Previewer
 * Created by onlyfu on 2020/09/16.
 */
App.module.extend('previewer', function() {
    //
    let self = this;

    this.init = function() {
        //
        this.md = window.markdownit();
        //
        Model.set('content', '').watch('content', this.renderContent);
        Model.set('toc', '').watch('toc', this.renderToc);
        Model.watch('showToc', this.renderTocIcon);
        Model.set('previewerScrollTop', 0).watch('previewerScrollTop', this.renderScrollTop);
        //
        this.view.display('previewer', 'layout', {}, $('#previewer-container'));
        //
        let showToc = localStorage.getItem('showToc');
        Model.set('showToc', showToc === 'true' ? true : false);
    };

    this.renderContent = function(content) {
        //
        let container = $('#previewer');
        if (content) {
            // container.html(marked(content));
            container.html(self.md.render(content));
            //
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightBlock(block);
            });
            //
        } else {
            self.view.display('previewer', 'empty', {}, container);
        }
        //
        Model.set('toc', new Date().getTime());
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
                title: $(this).text(),
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
        let target = $('#previewer'), 
            scrollHeight = target.prop('scrollHeight'), 
            clientHeight = target.outerHeight(),
            scrollTop = (scrollHeight - clientHeight) * percent;
        //
        $('#previewer').animate({scrollTop: scrollTop}, 0);
    };
});