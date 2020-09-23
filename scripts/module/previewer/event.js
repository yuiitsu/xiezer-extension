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
        }
    }
});