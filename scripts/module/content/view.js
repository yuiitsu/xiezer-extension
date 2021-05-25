/**
 * CES Content View
 */
App.view.extend('content', function() {

    this.layout = function() {
        return `
            <div class="xiezer-container xiezer-content-module" id="xiezer" style="display:none;">
                <div class="xiezer-header-container">
                    ONEHEART TRANSLATION MODE
                    <span class="xiezer-header-x">
                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    </span>
                </div>
                <div class="xiezer-main-container">
                    <div class="xiezer-origin-content-container">
                        <h1>{{ data.title }}</h1>
                        <div>{{ data.content }}</div>
                    </div>
                    <div class="xiezer-editor-container display-flex-column">
                        <div id="xiezer-editor" class="display-flex-auto"></div>                       
                        <div class="editor-entity-autosave-status"></div>
                    </div>
                </div>
            </div>
        `;
    };
});