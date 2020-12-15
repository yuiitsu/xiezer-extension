/**
 * CES Content View
 */
App.view.extend('images', function() {

    this.layout = function() {
        return `
            <div class="images-lib-container display-flex-column">
                <div class="images-lib-action-bar display-flex-row">
                    <div class="images-lib-current-container">
                        {{ this.view.getView('images', 'defaultPath', data.defaultPath) }}
                    </div>
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
                
                <div class="images-lib-main display-flex-auto display-flex-row">
                    <div class="images-lib-side"></div>   
                    <div class="images-lib-list-container display-flex-auto display-flex-column">
                        {{ this.view.getView('images', 'listLoading', {}) }}
                    </div>
                </div>
                <div class="images-lib-loading hide">
                    <div class="loading">
                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-clockwise" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                        </svg> loading...
                    </div>
                </div>
            </div>
        `;
    };

    this.libs = function() {
        return `
            <ul>
                {{ for var i in data.list }}
                {{ var item = data.list[i] }}
                {{ var focusClass = item.toLowerCase() === data.selected || (!data.selected && i === 0) ? 'focus': '' }}
                <li class="{{ focusClass }}">{{ item }}</li>
                {{ end }}
            </ul>
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

    this.uploadComplete = function() {
        return `
            <div class="images-uploading-completed">All files uploaded successfully. please wait...</div>
        `;
    };

    this.imageList = function() {
        return `
            <div class="images-lib-list-nav display-flex-row">
                <div class="display-flex-auto">
                    <span data-index="-1">
                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-house" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M2 13.5V7h1v6.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V7h1v6.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5zm11-11V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"/>
                            <path fill-rule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"/>
                        </svg>
                    </span> 
                    {{ for var i in data.pathList }}
                    {{ var item = data.pathList[i] }}
                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chevron-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                    </svg> 
                    <span data-index="{{ i }}">{{ item }}</span>
                    {{ end }}
                </div>
                <div class="images-lib-path-set-default">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-flag" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001M14 1.221c-.22.078-.48.167-.766.255-.81.252-1.872.523-2.734.523-.886 0-1.592-.286-2.203-.534l-.008-.003C7.662 1.21 7.139 1 6.5 1c-.669 0-1.606.229-2.415.478A21.294 21.294 0 0 0 3 1.845v6.433c.22-.078.48-.167.766-.255C4.576 7.77 5.638 7.5 6.5 7.5c.847 0 1.548.28 2.158.525l.028.01C9.32 8.29 9.86 8.5 10.5 8.5c.668 0 1.606-.229 2.415-.478A21.317 21.317 0 0 0 14 7.655V1.222z"/>
                    </svg>
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
            <div class="display-flex-auto images-lib-list display-flex-row">
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
                <div class="images-lib-info display-flex-auto">
                    Github API has an upper limit of 1,000 files for a directory.
                </div>
            </div>
            <div class="images-lib-bottom display-flex-row">
                <div class="display-flex-auto images-lib-bottom-info">{{ data.count }} images</div>
                <div class="images-lib-page">
                    <div class="images-lib-page-item disabled">
                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chevron-bar-left" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M11.854 3.646a.5.5 0 0 1 0 .708L8.207 8l3.647 3.646a.5.5 0 0 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 0 1 .708 0zM4.5 1a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 1 0v-13a.5.5 0 0 0-.5-.5z"/>
                        </svg>
                    </div>
                    <div class="images-lib-page-item disabled">
                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chevron-left" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                        </svg>
                    </div>
                    <div class="images-lib-page-item disabled">
                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chevron-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    </div>
                    <div class="images-lib-page-item disabled">
                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chevron-bar-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M4.146 3.646a.5.5 0 0 0 0 .708L7.793 8l-3.647 3.646a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708 0zM11.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5z"/>
                        </svg>
                    </div>
                </div>
            </div>
        `;
    };

    this.imageListItem = function() {
        return `
            <div class="images-lib-item">
                {{ if data.type === 'image' }}
                {{ var name = data.path ? data.path : data.name }}
                <div class="images-lib-item-parent">
                    <span class="images-lib-item-delete hide" data-sha="{{ data.sha }}" data-name="{{ name }}" data-lib="{{ data.lib }}">
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
                    <div class="images-list-item-action-item-lib">{{ data.lib }}</div>
                    <div class="images-list-item-action-item">
                        <input type="text" value="![{{ data.name }}]({{ data.url }})" class="images-lib-item-code" />
                    </div>
                </div>
                {{ else }}
                <div class="images-lib-item-dir-container" data-name="{{ data.name }}" data-path="{{ data.path }}">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-folder-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3zm-8.322.12C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139z"/>
                    </svg>
                </div>
                <div class="images-list-item-action">
                    <div class="images-list-item-action-item-lib">{{ data.lib }}</div>
                    <div class="images-list-item-dir-name">
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
    };

    this.miniUpload = function() {
        return `
            <div class="mini-upload-container images-uploading-progress-container display-flex-row"></div>
        `;
    };

    this.defaultPath = function() {
        return `
            Default: 
            <span class="images-lib-current"> {{ data.lib }}</span>  
            {{ for var i in data.path }}
            <span class="images-lib-current"> > {{ data.path[i] }}</span> 
            {{ end }}
        `;
    }
});