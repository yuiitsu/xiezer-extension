/**
 * Created by onlyfu on 2019/03/05.
 */
App.module.extend('images', function() {

    let self = this, 
        defaultLib = 'github', 
        isUploading = false;

    //
    this.init = function() {
        Model.set('imageList', []).watch('imageList', this.renderList);
        Model.set('imageUploadProgress', {}).watch('imageUploadProgress', this.renderProgress);
    };

    this.show = function() {
        //
        let container = self.module.component.module({
            name: 'Image Lib'
        }, self.view.getView('images', 'layout', {
        }), '');
        //
        this.listen(container);
        //
        this.lib.load();
    };

    this.renderList = function(data) {
        let list = [];
        data.forEach(element => {
            if (element.type === 'file') {
                if (['png', 'jpg', 'jpeg', 'bmp'].indexOf(element.name.substring(element.name.lastIndexOf('.') + 1)) !== -1) {
                    list.push({
                        url: element.download_url,
                        name: element.name
                    });
                }
            }
        });
        self.view.display('images', 'imageList', {list: list, count: list.length}, $('.images-lib-list-container'));
        //
        $('.images-lib-item-img-container').each(function() {
            let _this = $(this), 
                src = _this.attr('data-src'), 
                img = new Image();
            //
            img.src = src;
            img.onload = function() {
                _this.html('<img src="'+ src +'" title="Click to insert" />');
            }
        });
    };

    this.renderProgress = function(data) {
        if (data) {
            self.view.display('images', 'progress', data, $('.images-uploading-progress-container'));
        } else {
            $('.images-uploading-progress-container').html('');
        }
    };

    this.lib = {
        load: function() {
            this[defaultLib].queryPage();
        },
        github: {
            queryPage: function() {
                self.module.component.request('https://api.github.com/repos/yuiitsu/image_lib/contents?page=1&per_page=10', {
                    headers: {
                        'Authorization': 'token eb034ea63f10a54b60cff4c94cd07b882dff0bed'
                    }
                }, {}, function(response) {
                    console.log(response);
                    Model.set('imageList', response);
                })
            }
        }
    };

    this.listen = function(container) {
        //
        container.on('click', '.images-lib-item-img-container', function(e) {
            let url = $(this).attr('data-src'), 
                content = '![]('+ url +')';
            self.module.editor.insertContent(content);
            container.remove();
            //
            e.stopPropagation();
        });
        //
        container.on('click', '.images-lib-item-code', function(e) {
            $(this).select();
            document.execCommand('Copy');
            self.module.component.notification('Copy sucessfully.');
            e.stopPropagation();
        });
        //
        container.find('#fileUploader').on('change', function(e) {
            if (isUploading) {
                self.module.component.notification('Uploading, please wait.', 'danger');
                return false;
            }
            let files = e.target.files, 
                imgMasSize = 1024 * 1024 * 10, 
                fileTypes = ['jpeg', 'png', 'gif', 'jpg'], 
                filesCount = files.length;
            //
            if (filesCount === 0) {
                return false;
            }
            //
            for (let i = 0; i < filesCount; i++) {
                let file = files[i];
                if(fileTypes.indexOf(file.type.split("/")[1]) < 0){
                    self.module.component.notification('File type must be ' + fileTypes, 'danger');
                    return;
                }
            }

            let progressData = {
                currentNum: 1,
                total: filesCount,
                complete: 0
            }
            Model.set('imageUploadProgress', progressData);      
            //
            files = Array.from(files);
            self.reader = new FileReader();
            self.prepareUploadData(files, 1);
        });
        
    };

    this.prepareUploadData = function(files, num) {
        let file = files.pop(); 
        let fileType = file.type.split("/")[1],
            name = self.module.data._uuid() + '.' + fileType, 
            progressData = Model.get('imageUploadProgress');
        //
        self.reader.onload = function(e) {
            //
            progressData.currentNum = num;
            progressData.complete = 0;
            Model.set('imageUploadProgress', progressData);
            //
            self.uploadImg(progressData, name, e.target.result, function() {
                if (files.length > 0) {
                    self.prepareUploadData(files, num + 1);
                } else {
                    isUploading = false;
                    self.lib.load();
                    Model.set('imageUploadProgress', '');
                }
            });
        };
        self.reader.readAsDataURL(file);       
    };

    this.uploadImg = function(progressData, name, base64Data, callback) {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', (e)=>{
            console.log(e.loaded / e.total)
            progressData.complete = parseInt(e.loaded / e.total * 100);
            Model.set('imageUploadProgress', progressData);
        }, false);
        // xhr.addEventListener('load', ()=>{console.log("加载中");}, false);
        xhr.addEventListener('error', ()=>{Toast.error("上传失败！", 2000, undefined, false);}, false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                const result = JSON.parse(xhr.responseText);
                if (xhr.status === 200 || xhr.status === 201) {
                    // self.lib.load();
                    console.log('upload success');
                    callback();
                } else {
                    self.module.component.notification('Upload failed.', 'danger');
                    console.log('upload failed');
                }
            }
        };
        xhr.open('PUT', 'https://api.github.com/repos/yuiitsu/image_lib/contents/' + name, true);
        xhr.setRequestHeader('Authorization', 'token eb034ea63f10a54b60cff4c94cd07b882dff0bed');
        let formData = {
            message: 'upload image',
            content: base64Data.split(',')[1]
        }
        xhr.send(JSON.stringify(formData));
    }
});
