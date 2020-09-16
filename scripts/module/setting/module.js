/**
 * Setting
 * Created by onlyfu on 2020/09/16.
 */
App.module.extend('setting', function() {
    //
    let self = this;

    this.init = function() {
        //
        this.view.display('setting', 'layout', {}, $('#setting'));
    };
});