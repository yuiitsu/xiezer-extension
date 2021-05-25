/**
 * Setting View
 * Created by onlyfu on 2021/01/12.
 */
App.view.extend('setting', function() {

    this.layout = function() {
        return `
            {{ var isAESClass = data.isAES ? 'setting-main-item-seitch-open' : '' }}
            <div class="setting-layout display-flex-row">
                <div class="setting-side">
                    <div class="setting-side-item">AES</div>
                    <div class="setting-side-item">云存储</div>
                </div>
                <div class="setting-main-container display-flex-auto">
                    <div class="setting-main-item-container">
                        <h2>AES</h2>
                        <div class="setting-main-item">
                            <div class="display-flex-row">
                                <div class="setting-main-item-content display-flex-auto">
                                    <!--
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
                                        <path d="M12.14 8.753l-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                                    </svg>
                                    -->
                                    开启内容加密
                                </div>
                                <div class="setting-main-item-switch {{ isAESClass }}" id="setting-aes-switch">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                                    </svg>
                                </div>
                            </div>
                            <div class="setting-main-item-description">
                                <p>开启并输入密钥后，所有内容将转为加密存储，包括云存储</p>
                                <p>关闭并输入密钥后，所有内容将转为明文存储</p>
                                <p class="color-red">您的密钥只存在于当前运行环境的内存里，不会存入缓存，更不会存储在云端。刷新或重开页面后，必须再次输入密钥。请牢记您的密钥，一但丢失将无法再获取已加密内容</p>
                            </div>
                        </div>
                        <h2>云存储</h2>
                        <div class="setting-main-item">
                            <div class="display-flex-row">
                                <div class="setting-main-item-content display-flex-auto">
                                    <!--
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
                                        <path d="M12.14 8.753l-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                                    </svg>
                                    -->
                                    开启
                                </div>
                                <div class="setting-main-item-switch setting-main-item-seitch-close">
                                    暂未支持
                                    <!--
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                                    </svg>
                                    -->
                                </div>
                            </div>
                            <div class="setting-main-item-description">
                                <p>开启并登录您的帐号后，您的内容将在本地与云端同步。</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    this.AESSecretForm = function() {
        return `
            <div class="setting-aes-form">
                <div class="display-flex-row">
                    <div class="display-flex-auto">
                        <input type="text" class="setting-aes-form-secret-input" placeholder="Input AES Secrect" />
                    </div>
                    <div class="setting-aes-form-confirm">
                        <button class="btn btn-primary" id="setting-aes-form-confirm">Confirm</button>
                    </div>
                </div>
            </div>
        `;
    };

    this.AESScretEntrance = function() {
        return `
            <div class="prepare-container">
                <div class="prepare-main">
                    <div class="prepare-logo display-flex-row">
                        <div class="display-flex-auto">
                            OneHeart
                        </div>
                        <div class="logo-bg">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-vector-pen" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M10.646.646a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1 0 .708l-1.902 1.902-.829 3.313a1.5 1.5 0 0 1-1.024 1.073L1.254 14.746 4.358 4.4A1.5 1.5 0 0 1 5.43 3.377l3.313-.828L10.646.646zm-1.8 2.908l-3.173.793a.5.5 0 0 0-.358.342l-2.57 8.565 8.567-2.57a.5.5 0 0 0 .34-.357l.794-3.174-3.6-3.6z"/>
                                <path fill-rule="evenodd" d="M2.832 13.228L8 9a1 1 0 1 0-1-1l-4.228 5.168-.026.086.086-.026z"/>
                            </svg> 
                        </div>
                    </div>
                    <div class="prepare-content">
                        <div class="setting-aes-secret-entrance-input">
                            <input type="password" class="setting-aes-form-secret-input" placeholder="Enter AES Secrect" />
                        </div>
                        <div class="setting-aes-secret-entrance-button">
                            <button class="btn btn-primary" id="setting-aes-form-confirm">OK</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };
});
