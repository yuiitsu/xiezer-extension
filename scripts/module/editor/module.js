/**
 * Editor
 * Created by onlyfu on 2020/09/16.
 */
App.module.extend('editor', function() {
    //
    let self = this;

    this.init = function() {
        this.view.display('editor', 'layout', {}, $('#editor'));
    };
});