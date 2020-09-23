/**
 * Page Init View
 * Created by onlyfu on 2020/09/16.
 */
App.view.extend('init', function() {

    this.layout = function() {
        return `
            <div class="display-flex display-flex-column main-container">
                <div class="viewpoint-container display-flex display-flex-row display-flex-auto">
                    <div id="folder" class="folder-container"></div>
                    <div id="notes" class="notes-container"></div>
                    <div class="viewpoint display-flex display-flex-row display-flex-auto">
                        <div id="editor" class="edit-container display-flex-auto"></div>
                        <div id="previewer-container" class="preview-container display-flex-auto"></div>
                        <div id="toc" class="toc-container display-flex-column"></div>
                    </div>
                </div>
            </div>
        `;
    }
});
