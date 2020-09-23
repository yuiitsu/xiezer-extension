/**
 * 通用View
 * Created by Yuiitsu on 2018/06/05.
 */
App.view.extend('component', function() {

    this.module = function() {
        return `
            <div class="module-box module-box-{{ data['module_id'] }}">
                <div class="module-mask" data-module-id="{{ data['module_id'] }}"></div>
                <div class="module-content bg-level-4 border-level-2">
                    <div class="module-header border-bottom-level-1">{{ data['name'] }}
                        <i class="mdi mdi-close fr module-close" data-module-id="{{ data['module_id'] }}"></i>
                    </div>
                    <div class="module-main">{{ data['content'] }}</div>
                    <div class="module-actions">{{ data['action'] }}</div>
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
            <div id="notification-box" class="bg-{{ data['bg'] }}">{{ data['text'] }}</div>
        `;
    };

    this.dialog = function() {
        return `
            <div class="dialog dialog-{{ data['dialog_id'] }}">
                <div class="module-mask"></div>
                <div class="dialog-content bg-level-4 border-level-2">
                    <div class="dialog-header display-flex-row">
                        <h3 class="display-flex-auto"></h3>
                        <div class="dialog-close" data-dialog-id="{{ data['dialog_id'] }}">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </div>
                    </div>
                    <div class="dialog-msg">{{ data['msg'] }}</div>
                    <div class="dialog-action">
                        <div class="dialog-action-button" data-dialog-id="{{ data['dialog_id'] }}" data-type="confirm">
                            <button class="btn btn-primary">OK</button>
                        </div>
                        {{ if data['type'] === 'confirm' }}
                        <div class="dialog-action-button" data-dialog-id="{{ data['dialog_id'] }}" data-type="cancel">
                            <button class="btn btn-default">Cancel</button>
                        </div>
                        {{ end }}
                    </div>
                </div>
            </div>
        `;
    };
});

