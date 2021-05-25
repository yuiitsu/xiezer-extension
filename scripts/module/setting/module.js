/**
 * Setting
 * Created by onlyfu on 2021/01/12.
 */
App.module.extend('setting', function() {

    let self = this;

    this.init = function() {
    }

    this.show = function() {
        self.sendMessage('data', 'getSettings', {}, function(settings) {
            let container = self.module.component.module({
                container: $('html'),
                name: 'Settings',
                width: 800,
            }, self.view.getView('setting', 'layout', {
                isAES: settings.isAES
            }), '');
        });
        
    };

    this.showAES = function() {
        self.sendMessage('data', 'getSettings', {}, function(settings) {
            let isAES = settings.isAES;
            let container = self.module.component.module({
                container: $('html'),
                name: isAES ? 'Decrypt' : 'Encrypt',
                width: 300,
            }, self.view.getView('setting', 'AESSecretForm', {
            }), '');
            //
            container.find('#setting-aes-form-confirm').on('click', function() {
                let secret = $.trim(container.find('.setting-aes-form-secret-input').val()), 
                    AESSecret = Model.get('AESSecret');
                if (!secret) {
                    return false;
                }
                // alert(Model.get('AESSecret'));
                if (isAES) {
                    if (AESSecret !== secret) {
                        self.module.component.dialog().show('ok', 'System Info', 'Secret error, please try again.', function() {
                            // self.module.data.deleteNotes();
                        });
                    } else {
                        alert('Decrypt');
                    }
                }
            });
        })
    };

    this.showAESSecretForm = function() {
        this.view.display('setting', 'AESScretEntrance', {}, $('#main-container'));
        //
        $('#setting-aes-form-confirm').off('click').on('click', function() {
            let secret = $('.setting-aes-form-secret-input').val();
            // if (!secret) {
            //     return false;
            // }
            secret = secret ? secret : '{{notUse}}';
            self.setAESSecret(secret);
            self.module.init._init();
        });
    };

    this.setIsAES = function(isAES) {
        self.sendMessage('data', 'setIsAES', isAES, function() {

        });
    };

    this.setAESSecret = function(secret) {
        Model.set('AESSecret', secret);
    };
});
 