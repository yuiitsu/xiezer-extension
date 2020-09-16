/**
 * Editor
 * Created by onlyfu on 2020/09/16.
 */
App.view.extend('editor', function() {

    this.layout = function() {
        return `
            <div class="editor-main display-flex display-flex-column">
                <div class="editor-title" contentEditable=true></div>
                <div class="display-flex-auto">
                    <textarea class="editor-content"></textarea>
                </div>
            </div>
        `;
    }
});
