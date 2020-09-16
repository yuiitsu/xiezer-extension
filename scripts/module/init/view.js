/**
 * Page Init View
 * Created by onlyfu on 2020/09/16.
 */
App.view.extend('init', function() {

    this.layout = function() {
        return `
            <div class="display-flex display-flex-row main-container">
                <div id="category" class="category-container"></div>
                <div class="display-flex display-flex-column display-flex-auto">
                    <div id="setting" class="setting-container"></div>
                    <div class="display-flex display-flex-row display-flex-auto">
                        <div id="editor" class="edit-container display-flex-auto"></div>
                        <div id="previewer-container" class="preview-container display-flex-auto"></div>
                    </div>
                </div>
            </div>
        `;
    }
});
