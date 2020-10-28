/**
 * 通用View
 * Created by Yuiitsu on 2018/06/05.
 */
App.view.extend('component', function() {

    this.module = function() {
        return `
            <div class="xiezer-content-module xiezer-module-box module-box-{{ data['module_id'] }}">
                <div class="xiezer-module-mask" data-module-id="{{ data['module_id'] }}"></div>
                <div class="xiezer-module-content bg-level-4 border-level-2">
                    <div class="xiezer-module-header border-bottom-level-1 display-flex-row">
                        <div class="display-flex-auto">
                            {{ data['name'] }}
                        </div>
                        {{ if !data.noClose }}
                        <div class="xiezer-module-close">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </div>
                        {{ end }}
                    </div>
                    <div class="xiezer-module-main">{{ data['content'] }}</div>
                    <div class="xiezer-module-actions">{{ data['action'] }}</div>
                </div>
            </div>
        `;
    };

    this.tips = function() {
        return `
            <div id="tips-box" class="tips-container bg-level-4 border-level-2">
                <div class="tips-array">
                    <span class="tips-array-out"></span>
                    <span class="tips-array-in"></span>
                </div>
                <div id="tips-content">{{ data['content'] }}</div>
            </div>
        `;
    };

    this.notification = function() {
        return `
            <div id="notification-box" class="notification-{{ data['bg'] }}">{{ data['text'] }}</div>
        `;
    };

    this.dialog = function() {
        return `
            <div class="xiezer-content-module xiezer-dialog dialog-{{ data['dialog_id'] }}">
                <div class="xiezer-module-mask"></div>
                <div class="xiezer-dialog-content bg-level-4 border-level-2">
                    <div class="xiezer-dialog-header display-flex-row">
                        <div class="display-flex-auto">
                            <strong>{{ data.title }}</strong>
                        </div>
                        <div class="xiezer-dialog-close" data-dialog-id="{{ data['dialog_id'] }}">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </div>
                    </div>
                    <div class="xiezer-dialog-msg">{{ data['msg'] }}</div>
                    <div class="xiezer-dialog-action">
                        <div class="xiezer-dialog-action-button" data-dialog-id="{{ data['dialog_id'] }}" data-type="confirm">
                            <button class="xiezer-btn xiezer-btn-primary">OK</button>
                        </div>
                        {{ if data['type'] === 'confirm' }}
                        <div class="xiezer-dialog-action-button" data-dialog-id="{{ data['dialog_id'] }}" data-type="cancel">
                            <button class="xiezer-btn xiezer-btn-default">Cancel</button>
                        </div>
                        {{ end }}
                    </div>
                </div>
            </div>
        `;
    };

    this.loading = function() {
        return `
            <div class="loading">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-clockwise" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                </svg>
            </div>
        `;
    };

    this.lock = function() {
        return `
            <div class="lock-container locked" data-id="{{ data.id }}" data-name="{{ data.name }}" data-action="clearLockPassword">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-lock-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 9a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2V9z"/>
                    <path fill-rule="evenodd" d="M4.5 4a3.5 3.5 0 1 1 7 0v3h-1V4a2.5 2.5 0 0 0-5 0v3h-1V4z"/>
                </svg>
            </div>
            <div class="lock-container unlocked" data-id="{{ data.id }}" data-name="{{ data.name }}" data-action="lock">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-unlock" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M9.655 8H2.333c-.264 0-.398.068-.471.121a.73.73 0 0 0-.224.296 1.626 1.626 0 0 0-.138.59V14c0 .342.076.531.14.635.064.106.151.18.256.237a1.122 1.122 0 0 0 .436.127l.013.001h7.322c.264 0 .398-.068.471-.121a.73.73 0 0 0 .224-.296 1.627 1.627 0 0 0 .138-.59V9c0-.342-.076-.531-.14-.635a.658.658 0 0 0-.255-.237A1.122 1.122 0 0 0 9.655 8zm.012-1H2.333C.5 7 .5 9 .5 9v5c0 2 1.833 2 1.833 2h7.334c1.833 0 1.833-2 1.833-2V9c0-2-1.833-2-1.833-2zM8.5 4a3.5 3.5 0 1 1 7 0v3h-1V4a2.5 2.5 0 0 0-5 0v3h-1V4z"/>
                </svg>
            </div>
        `;
    };

    this.lockForm = function() {
        return `
            <div class="lockForm">
                <div class="lock-line lock-title">{{ data.name }}</div>
                <div class="lock-line"><input type="password" id="password" class="form-control" placeholder="Password" autofocus="autofocus" /></div>
                <div class="lock-line"><input type="password" id="confirm-password" class="form-control" placeholder="Confirm password" /></div>
                <div class="lock-line warring">
                    This will only create a query password and not encrypt the contents of note. 
                    if you want to encrypt the note, please set AES encryption.
                </div>
                <div class="lock-button">
                    <button class="btn btn-primary lock-confirm" data-id="{{ data.id }}">Lock</button>
                </div>
            </div>
        `;
    };

    this.unlockForm = function() {
        return `
            <div class="lockForm">
                <div class="lock-line lock-title">{{ data.name }}</div>
                <div class="lock-line"><input type="password" id="password" class="form-control" placeholder="Password" autofocus="autofocus" /></div>
                <div class="lock-button">
                    <button class="btn btn-primary unlock-confirm" data-id="{{ data.id }}">Unlock</button>
                </div>
            </div>
        `;
    };
});

