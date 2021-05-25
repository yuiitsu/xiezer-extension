/**
 * Page Init View
 * Created by onlyfu on 2020/09/16.
 */
App.view.extend('init', function() {

    this.layout = function() {
        return `
            {{ var previewOnlyEditorHideClass = data.previewOnly === 'true' ? 'hide' : '' }}
            <div class="display-flex display-flex-column main-container">
                <div class="viewpoint-container display-flex display-flex-row display-flex-auto">
                    <div id="folder" class="folder-container"></div>
                    <div id="notes" class="notes-container"></div>
                    <div class="viewpoint display-flex display-flex-row display-flex-auto">
                        <div class="display-flex-auto display-flex-column editor-previewer-container">
                            <div class="display-flex-auto display-flex-row editor-column">
                                <div id="xiezer-editor" class="editor-container display-flex-auto {{ previewOnlyEditorHideClass }}"></div>
                                <div id="previewer-container" class="preview-container display-flex-auto"></div>
                            </div>
                            <div class="editor-entity-status-bar display-flex-row">
                                <div class="display-flex-auto editor-entity-autosave-status"></div>
                                <div class="editor-entity-characters-count">
                                    <span>0</span> Characters
                                </div>
                            </div>
                        </div>
                        <div class="toc-container display-flex-column">
                            <div class="header">Table of Contents</div>
                            <div id="toc" class="toc-content display-flex-auto"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    this.mini = function() {
        return `
            <div class="folder-mini display-flex-row">
                <div class="display-flex-auto folder-mini-item folder-mini-logo">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chevron-bar-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M4.146 3.646a.5.5 0 0 0 0 .708L7.793 8l-3.647 3.646a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708 0zM11.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5z"/>
                    </svg> 
                    OneHeart
                </div>
            </div>
        `;
    };

    this.prepare = function() {
        return `
            <div class="prepare-container">
                <div class="prepare-main">
                    <div class="prepare-logo display-flex-row">
                        <div class="display-flex-auto">
                            OneHeart.ink
                        </div>
                        <div class="logo-bg">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-vector-pen" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M10.646.646a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1 0 .708l-1.902 1.902-.829 3.313a1.5 1.5 0 0 1-1.024 1.073L1.254 14.746 4.358 4.4A1.5 1.5 0 0 1 5.43 3.377l3.313-.828L10.646.646zm-1.8 2.908l-3.173.793a.5.5 0 0 0-.358.342l-2.57 8.565 8.567-2.57a.5.5 0 0 0 .34-.357l.794-3.174-3.6-3.6z"/>
                                <path fill-rule="evenodd" d="M2.832 13.228L8 9a1 1 0 1 0-1-1l-4.228 5.168-.026.086.086-.026z"/>
                            </svg> 
                        </div>
                    </div>
                    <div class="prepare-content display-flex-row">
                        {{ this.view.getView('init', 'loading', {}) }}
                    </div>
                </div>
            </div>
        `;
    };

    this.loading = function() {
        return `
            <div class="prepare-icon prepare-loading loading">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-clockwise" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                </svg>
            </div>
            <div class="display-flex-auto">Preparing ...</div>
        `;
    };

    this.error = function() {
        return `
            <div class="prepare-icon prepare-error">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-info-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                </svg>
            </div>
            <div class="display-flex-auto prepare-error">{{ data.message }}</div>
        `;
    };
});
