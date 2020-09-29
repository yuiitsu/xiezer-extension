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
                        <div class="images-lib-action">
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
                    </div>
                    <div class="images-lib-list-container display-flex-auto display-flex-column">
                        <div class="images-lib-list-loading">
                            <div class="prepare-icon prepare-loading loading">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-clockwise" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                                </svg> loading...
                            </div>
                        </div>
                    </div>
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
            <div class="display-flex-auto images-lib-list">
                <div class="images-lib-list-inbox">
                    {{ for var i in data.list }}
                    {{ var item = data.list[i] }}
                    <div class="images-lib-item">
                        <div class="images-lib-item-img-container" data-src="{{ item.url }}">
                            <div class="prepare-icon prepare-loading loading">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-clockwise" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="images-list-item-action">
                            <div class="images-list-item-action-item">
                                <input type="text" value="![{{ item.name }}]({{ item.url }})" class="images-lib-item-code" />
                            </div>
                        </div>
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
    }
});