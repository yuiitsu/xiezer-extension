/**
 * Folder
 * Created by onlyfu on 2020/09/16.
 */
App.module.extend('folder', function() {
    //
    let self = this;

    this.init = function() {
        //
        this.view.display('folder', 'layout', {}, $('#folder'));
    };
});