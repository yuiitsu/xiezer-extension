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
        //
        this.view.display('previewer', 'layout', {}, $('#previewer-container'));
    };

    this.renderContent = function() {
        let content = Model.get('content');
        //
        content = content ? content : '';
        //
        $('#previewer').html(self.md.render(content));
        //
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
        });
        //
        // $('#previewer').html(markdown.toHTML(title + content));
        //
        // let $img = $('#previewer').find('img');
        // if (images.length > 0) {
        //     let i = 0;
        //     $img.each(function() {
        //         $(this).prop('outerHTML', images[i]);
        //         i++;
        //     });
        // } 
        // $img.each(function() {
        //     // self.log($(this).prop('outerHTML'));
        //     images.push($(this).prop('outerHTML'));
        // });
    };
});