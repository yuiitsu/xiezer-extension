/**
 * Page Init
 * Created by onlyfu on 2020/09/16.
 */
App.module.extend('init', function() {
    //
    let self = this;

    this.init = function() {
        this.view.display('init', 'layout', {}, $('#main-container'));
    };
});