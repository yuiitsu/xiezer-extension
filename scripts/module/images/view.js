/**
 * CES Content View
 */
App.view.extend('images', function() {

    this.layout = function() {
        return `
            <div class="images-lib-container display-flex-row">
                <div class="images-lib-side">
                    <ul>
                        <li class="focus">Github</li>
                        <li class="disabled">Gitee</li>
                        <li class="disabled">Qiniu</li>
                    </ul>
                </div>
                <div class="images-lib-main display-flex-auto display-flex-column">
                    <div class="images-lib-action-bar display-flex-row">
                        <div class="images-uploading-progress-container display-flex-auto display-flex-row"></div>
                        <div class="images-lib-action images-lib-upload" for="file">
                            <label>
                                <input type="file" id="fileUploader" accept=“image/*” multiple class="hide" />
                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-upload" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                                    <path fill-rule="evenodd" d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                                </svg>
                            </label>
                        </div>
                        <div class="images-lib-action images-lib-create-folder">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-folder-plus" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M9.828 4H2.19a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91H9v1H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181L15.546 8H14.54l.265-2.91A1 1 0 0 0 13.81 4H9.828zm-2.95-1.707L7.587 3H2.19c-.24 0-.47.042-.684.12L1.5 2.98a1 1 0 0 1 1-.98h3.672a1 1 0 0 1 .707.293z"/>
                                <path fill-rule="evenodd" d="M13.5 10a.5.5 0 0 1 .5.5V12h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V13h-1.5a.5.5 0 0 1 0-1H13v-1.5a.5.5 0 0 1 .5-.5z"/>
                            </svg>
                        </div>
                        <div class="images-lib-action images-lib-setting">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-gear-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 0 0-5.86 2.929 2.929 0 0 0 0 5.858z"/>
                            </svg>
                        </div>
                        <div class="images-lib-action usage-link" data-url="/help/usage/image?a={{ Model.get('useLib') }}">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-question-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                            </svg>
                        </div>
                    </div>
                    <div class="images-lib-list-container display-flex-auto display-flex-column">
                        {{ this.view.getView('images', 'listLoading', {}) }}
                    </div>
                </div>
            </div>
        `;
    };

    this.listLoading = function() {
        return `
            <div class="images-lib-list-loading">
                <div class="prepare-icon prepare-loading loading">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-clockwise" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                    </svg> loading...
                </div>
            </div>
        `;
    };

    this.progress = function() {
        return `
            <div class="images-uploading-count">{{ data.currentNum }}/{{ data.total }}</div>
            <div class="display-flex-auto images-uploding-progress-bar-bg">
                <div class="images-uploding-progress-bar" style="width: {{ data.complete }}%;"></div>
            </div>
            <div class="images-uploding-complete">{{ data.complete }}%</div>
        `;
    };

    this.imageList = function() {
        return `
            <div class="images-lib-list-nav display-flex-row">
                <div class="display-flex-auto">
                    <span data-index="-1">root </span> 
                    {{ for var i in data.pathList }}
                    {{ var item = data.pathList[i] }}
                    > <span data-index="{{ i }}">{{ item }}</span>
                    {{ end }}
                </div>
                <div class="images-lib-list-nav-loading hide">
                    <div class="loading">
                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-clockwise" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="display-flex-auto images-lib-list">
                <div class="images-lib-list-inbox">
                    {{ if data.list.length > 0 }}
                    {{ for var i in data.list }}
                    {{ var item = data.list[i] }}
                    {{ this.view.getView('images', 'imageListItem', item) }}
                    {{ end }}
                    {{ else }}
                    <div class="images-lib-list-empty">
                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-inbox" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4H4.98zm9.954 5H10.45a2.5 2.5 0 0 1-4.9 0H1.066l.32 2.562a.5.5 0 0 0 .497.438h12.234a.5.5 0 0 0 .496-.438L14.933 9zM3.809 3.563A1.5 1.5 0 0 1 4.981 3h6.038a1.5 1.5 0 0 1 1.172.563l3.7 4.625a.5.5 0 0 1 .105.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374l3.7-4.625z"/>
                        </svg>
                        Empty
                    </div>
                    {{ end }}
                </div>
            </div>
            <div class="images-lib-bottom-tips">Github API has an upper limit of 1,000 files for a directory.</div>
            <div class="images-lib-bottom display-flex-row">
                <div class="display-flex-auto images-lib-bottom-info">{{ data.count }} images</div>
                <div class="images-lib-page">
                    <button class="" disabled="disabled">Prev</button>
                    <button class="" disabled="disabled">Next</button>
                </div>
            </div>
        `;
    };

    this.imageListItem = function() {
        return `
            <div class="images-lib-item">
                {{ if data.type === 'image' }}
                <div class="images-lib-item-parent">
                    <span class="images-lib-item-delete hide" data-sha="{{ data.sha }}" data-name="{{ data.name }}">
                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    </span>
                    <div class="images-lib-item-container images-lib-item-img-container" data-src="{{ data.url }}">
                        <div class="prepare-icon prepare-loading loading">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-clockwise" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="images-list-item-action">
                    <div class="images-list-item-action-item">
                        <input type="text" value="![{{ data.name }}]({{ data.url }})" class="images-lib-item-code" />
                    </div>
                </div>
                {{ else }}
                <div class="images-lib-item-dir-container" data-name="{{ data.name }}" data-path="{{ data.path }}">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-folder" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.828 4a3 3 0 0 1-2.12-.879l-.83-.828A1 1 0 0 0 6.173 2H2.5a1 1 0 0 0-1 .981L1.546 4h-1L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3v1z"/>
                        <path fill-rule="evenodd" d="M13.81 4H2.19a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4zM2.19 3A2 2 0 0 0 .198 5.181l.637 7A2 2 0 0 0 2.826 14h10.348a2 2 0 0 0 1.991-1.819l.637-7A2 2 0 0 0 13.81 3H2.19z"/>
                    </svg>
                </div>
                <div class="images-list-item-action">
                    <div class="images-list-item-action-item">
                        {{ data.name }}
                    </div>
                </div>
                {{ end }}
            </div>
        `;
    };

    this.imageListError = function() {
        return `
            <div class="images-lib-list-error-container">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-exclamation-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                </svg>
                {{ data.message }}
            </div>
        `;
    };

    this.setting_github = function() {
        return `
            {{ var user = data.user ? data.user : '' }}
            {{ var repos = data.repos ? data.repos : '' }}
            {{ var token = data.token ? data.token : '' }}
            <div class="images-lib-setting-container">
                <div class="images-lib-setting-line display-flex-column">
                    <label>Github User:</label>
                    <input type="text" class="form-control" name="user" value="{{ user }}" />
                </div>
                <div class="images-lib-setting-line display-flex-column">
                    <label>Github Repos:</label>
                    <input type="text" class="form-control" name="repos" value="{{ repos }}" />
                </div>
                <div class="images-lib-setting-line display-flex-column">
                    <label>Personal access token:</label>
                    <input type="text" class="form-control" name="token" value="{{ token }}" />
                </div>
                <div class="images-lib-setting-line images-lib-setting-action-line display-flex-row">
                    <button class="btn btn-primary images-lib-setting-save-github">Save</button>
                    <button class="btn btn-default images-lib-setting-cancel">Cancel</button>
                </div>
            </div>
        `;
    };

    this.create_folder_github = function() {
        return `
            <div class="images-lib-setting-container">
                <div class="images-lib-setting-line display-flex-column">
                    <label>Github Path:</label>
                    <input type="text" class="form-control" name="path" />
                </div>
                <div class="images-lib-setting-line color-red">
                    Example: path or path/path
                </div>
                <div class="images-lib-setting-line images-lib-setting-action-line display-flex-row">
                    <button class="btn btn-primary images-lib-setting-folder-save-github">Create</button>
                    <button class="btn btn-default images-lib-setting-cancel">Cancel</button>
                </div>
            </div>
        `;
    }
});