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
        this.log(this.md);
        //
        Model.set('title', '').watch('title', this.renderContent);
        Model.set('content', '').watch('content', this.renderContent);
        //
        this.view.display('previewer', 'layout', {}, $('#previewer-container'));
    };

    this.renderContent = function() {
        let title = Model.get('title'), 
            content = Model.get('content');
        //
        title = title ? title : '';
        content = content ? content : '';
        //
        // var result = this.md.render('# markdown-it rulezz!');
        $('#previewer').html(self.md.render(title + content));
        // $('#previewer').html(markdown.toHTML(title + content));
    };
});