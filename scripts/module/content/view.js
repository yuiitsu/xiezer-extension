/**
 * CES Content View
 */
App.view.extend('content', function() {

    this.layout = function() {
        return `
            <div class="xiezer-container" id="xiezer" style="display:none;">
                <div class="xiezer-header-container">XIEZER TRANSLATION MODE</div>
                <div class="xiezer-main-container">
                    <div class="xiezer-origin-content-container">
                        <h1>{{ data.title }}</h1>
                        <div>{{ data.content }}</div>
                    </div>
                    <div class="xiezer-editor-container" id="editor">
                        
                    </div>
                </div>
            </div>
        `;
    };
});