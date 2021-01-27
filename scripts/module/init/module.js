/**
 * Page Init
 * Created by onlyfu on 2020/09/16.
 * XIEZER 初始化模块
 * 1. 渲染布局
 * 2. 初始化其它所有调用模块
 * 3. 监听background message
 * 4. 发送ready消息给background，让它准备数据
 */
App.module.extend('init', function() {
    //
    let self = this, 
        previewOnly = 'false';

    this._init = function() {
        // open db
        this.view.display('init', 'prepare', {}, $('#main-container'));
        //
        previewOnly = localStorage.getItem('previewOnly');
        previewOnly = previewOnly ? previewOnly : 'false';
        // 检查是否开启AES加密
        self.sendMessage('data', 'getSettings', {}, function(settings) {
            let isAES = settings.isAES, 
                AESSecret = Model.get('AESSecret');
            if (isAES && !AESSecret) {
                // 已启用加密，需输入密码
                self.module.setting.showAESSecretForm();
            } else {
                // 初始化模块
                self.module.initialize();
                // 监听background message
                chrome.runtime.onMessage.addListener(function(request, _, callback) {
                    let module = request.module,
                        method = request.method,
                        data = request.data;
                    //
                    if (self.module[module] && self.module[module].hasOwnProperty(method)) {
                        self.module[module][method](data);
                    }
                    callback('');
                });
                // 发送ready消息
                chrome.runtime.sendMessage({
                    method: 'ready'
                }, function(res) {
                });
                //
                // this.module.data.openDb(function() {
                //     setTimeout(function() {
                //         self.module.initialize();
                //     }, 500);
                // }, function() {
                //     self.view.display('init', 'error', {message: 'Failed to open DB.'}, $('.prepare-content'));
                // });
            }
        });
    };

    this.init = function() {
        //
        Model.set('showToc', Model.default.showToc).watch('showToc', this.renderToc);
        Model.set('showNoteBook', Model.default.showNoteBook).watch('showNoteBook', this.renderNoteBook);
        Model.set('miniSwitch', false).watch('miniSwitch', this.renderMini);
        Model.set('previewOnly', previewOnly).watch('previewOnly', this.renderEditorHide);
        //
        this.view.display('init', 'layout', {previewOnly: previewOnly}, $('#main-container'));
        //
    };

    this.renderEditorHide = function(v) {
        if (v === 'true') {
            $('#xiezer-editor').addClass('hide');
        } else {
            $('#xiezer-editor').removeClass('hide');
        }
    };

    this.renderMini = function(status) {
        if (status) {
            self.view.append('init', 'mini', {}, $('body'));
        } else {
            $('.folder-mini').remove();
        }
    };

    this.renderToc = function(status) {
        let target = $('#toc');
        if (status) {
            target.show();
        } else {
            target.hide();
        }
    };

    this.renderNoteBook = function(status) {
        let noteBookContainer = $('#folder'), 
            miniContainer = $('.folder-mini');
        //
        if (status) {
            miniContainer.hide();
            noteBookContainer.show();
        } else {
            miniContainer.show();
            noteBookContainer.hide();
        }
    };

    this.switchPreviewMode = function(previewOnly) {
        if (!previewOnly) {
            previewOnly = Model.get('previewOnly');
            previewOnly = previewOnly === 'true' ? 'false' : 'true';
        }
        Model.set('previewOnly', previewOnly);
        localStorage.setItem('previewOnly', previewOnly);
    }
});