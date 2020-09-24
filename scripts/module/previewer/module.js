/**
 * Previewer
 * Created by onlyfu on 2020/09/16.
 */
App.module.extend('previewer', function() {
    //
    let self = this, 
        md = null;

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
        $('#previewer').html(self.md.render(content));
        //
        if (content) {
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightBlock(block);
            });
        }
        //
        Model.set('toc', new Date().getTime());
    };

    this.renderToc = function() {
        let toc = [];
        $('#previewer').find('h1, h2, h3, h4, h5').each(function() {
            toc.push({
                type: $(this)[0].nodeName,
                title: $(this).text()
            });
        });
        //
        self.view.display('previewer', 'toc', {list: toc}, $('#toc'));
    };

    this.renderTocIcon = function(status) {
        let target = $('#toc-switch');
        if (status) {
            target.addClass('focus');
        } else {
            target.removeClass('focus');
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