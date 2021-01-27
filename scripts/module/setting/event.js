/**
 * Setting Event
 */
App.event.extend('setting', function() {
    let self = this;

    this.event = {
        show: function() {
            $('.setting-button').on('click', function() {
                self.module.setting.show();
            });
        },

        aesSwitch: function() {
            $(document).on('click', '#setting-aes-switch', function(e) {
                self.module.setting.showAES(function() {

                });
                // let isAES = Model.get('isAES');
                // if (isAES) {
                //     $(this).removeClass('setting-main-item-seitch-open');
                // } else {
                //     $(this).addClass('setting-main-item-seitch-open');
                // }
                // self.module.setting.setIsAES(isAES ? 0 : 1);
                e.stopPropagation();
            });
        }
    }
});
