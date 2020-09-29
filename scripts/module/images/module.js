/**
 * Created by onlyfu on 2019/03/05.
 */
App.module.extend('images', function() {

    let self = this, 
        isQueryLoading = false,
        isUploading = false, 
        settingKey = {
            github: 'settingGithub'
        }, 
        pathList = [];

    //
    this.init = function() {
        Model.set('useLib', 'github');
        Model.set('imageList', []).watch('imageList', this.renderList);
        Model.set('imageListError', '').watch('imageListError', this.renderListError);
        Model.set('imageUploadProgress', {}).watch('imageUploadProgress', this.renderProgress);
    };

    this.show = function() {
        //
        pathList = [];
        //
        let container = self.module.component.module({
            name: 'Picture Library'
        }, self.view.getView('images', 'layout', {
        }), '');
        //
        this.listen(container);
        //
        this.lib.load();
        // $('.images-lib-create-folder').trigger('click');
    };

    this.renderList = function(data) {
        let dir = [], 
            list = [];
        data.forEach(element => {
            if (element.type === 'dir') {
                dir.push({
                    name: element.name,
                    path: element.path,
                    type: 'dir'
                });
            }
            if (element.type === 'file') {
                if (['png', 'jpg', 'jpeg', 'gif'].indexOf(element.name.substring(element.name.lastIndexOf('.') + 1)) !== -1) {
                    list.push({
                        url: element.download_url,
                        name: element.name,
                        type: 'image'
                    });
                }
            }
        });
        list = dir.concat(list);
        self.view.display('images', 'imageList', {list: list, count: list.length, pathList: pathList}, $('.images-lib-list-container'));
        //
        self.renderImage();
    };

    this.renderListError = function(message) {
        self.view.display('images', 'imageListError', {message: message}, $('.images-lib-list-container'));
    };

    this.renderProgress = function(data) {
        if (data) {
            self.view.display('images', 'progress', data, $('.images-uploading-progress-container'));
        } else {
            $('.images-uploading-progress-container').html('');
        }
    };

    this.renderImage = function() {
        $('.images-lib-item-img-container').each(function() {
            let _this = $(this), 
                src = _this.attr('data-src'), 
                loaded = _this.attr('data-loaded'), 
                img = new Image();
            //
            if (loaded !== 'tru') {
                img.src = src;
                img.onload = function() {
                    _this.attr('data-loaded', 'true');
                    _this.html('<img src="'+ src +'" title="Click to insert" />');
                }
            }
        });
    };

    this.lib = {
        reload: function() {
            self.view.display('images', 'listLoading', {}, $('.images-lib-list-container'));
            this.load();
        },
        load: function() {
            let useLib = Model.get('useLib');
            if (!Model.get('setting_' + useLib)) {
                try {
                    setting = JSON.parse(localStorage.getItem(settingKey[useLib]));
                    if (!setting) {
                        Model.set('imageListError', 'Please set the Github account first.');
                        return false;
                    }
                    Model.set('setting_' + useLib, setting);
                } catch (e) {
                    self.module.component.notification('Setting data error. please check setting.', 'danger');
                    return false;
                }
            }
            this[useLib].queryPage();
        },
        github: {
            queryPage: function() {
                if (isQueryLoading) {
                    return false;
                }
                isQueryLoading = true;
                self.loading.show();
                //
                let setting = Model.get('setting_github'), 
                    time = new Date().getTime();
                //
                path = pathList.length > 0 ? '/' + pathList.join('/') : '';
                self.module.component.request('https://api.github.com/repos/'+ setting.user +'/'+ setting.repos +'/contents'+ path +'?t=' + time, {
                    headers: {
                        'Authorization': 'token ' + setting.token
                    }
                }, {}, function(response, xhr) {
                    isQueryLoading = false;
                    self.loading.hide();
                    if (xhr.status !== 200) {
                        self.module.component.notification('Unauthorized, please check the token', 'danger');
                        Model.set('imageListError', 'Unauthorized, please check the token');
                        return false;
                    }
                    Model.set('imageList', response);
                });
            },
            upload: function(xhr, name, base64Data) {
                let setting = Model.get('setting_github');
                path = pathList.length > 0 ? pathList.join('/') + '/' : '';
                xhr.open('PUT', 'https://api.github.com/repos/'+ setting.user +'/'+ setting.repos +'/contents/' + path + name, true);
                xhr.setRequestHeader('Authorization', 'token ' + setting.token);
                let formData = {
                    message: 'upload image',
                    content: base64Data.split(',')[1]
                }
                xhr.send(JSON.stringify(formData));
            }
        }
    };

    this.loading = {
        show: function() {
            $('.images-lib-list-nav-loading').show();
        },
        hide: function() {
            $('.images-lib-list-nav-loading').hide();
        }
    }

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
        //
        container.find('.images-lib-setting').on('click', function() {
            let useLib = Model.get('useLib'), 
                setting = localStorage.getItem(settingKey[useLib]);
            //
            try {
                setting = JSON.parse(setting);
                setting = setting ? setting : {
                    user: '',
                    repos: '',
                    token: ''
                };
            } catch (e) {
                self.module.component.notification('Setting data error. please check setting.', 'danger');
                return false;
            }
            self.view.display('images', 'setting_' + useLib, setting, $('.images-lib-list-container'));
        });
        //
        container.on('click', '.images-lib-setting-save-github', function(e) {
            let userElement = container.find('input[name="user"]'),
                reposElement = container.find('input[name="repos"]'),
                tokenElement = container.find('input[name="token"]'),
                user = $.trim(userElement.val()), 
                repos = $.trim(reposElement.val()), 
                token = $.trim(tokenElement.val());
            //
            container.find('input').removeClass('error');
            if (!user) {
                userElement.addClass('error');
            }
            if (!repos) {
                reposElement.addClass('error');
            }
            if (!token) {
                tokenElement.addClass('error');
            }
            //
            let data = {
                user: user,
                repos: repos,
                token: token
            };
            localStorage.setItem(settingKey.github, JSON.stringify(data));
            Model.set('setting_' + Model.get('useLib'), data);
            self.module.component.notification('Save successfuly.');
            //
            self.lib.reload();
            e.stopPropagation();
        });
        //
        container.on('click', '.images-lib-setting-cancel', function(e) {
            self.lib.reload();
            e.stopPropagation();
        });
        //
        container.find('.images-lib-create-folder').on('click', function() {
            let useLib = Model.get('useLib'); 
            self.view.display('images', 'create_folder_' + useLib, {}, $('.images-lib-list-container'));
        });
        //
        container.on('click', '.images-lib-setting-folder-save-github', function(e) {
            let pathElement = container.find('input[name="path"]'),
                path = $.trim(pathElement.val());
            //
            container.find('input').removeClass('error');
            if (!path) {
                pathElement.addClass('error');
            }
            //
            self.createFolder(path + '/temp.md', 'base64,dGVtcA==', function(res) {
                self.lib.reload();
            });
            e.stopPropagation();
        });
        //
        container.on('click', '.images-lib-item-dir-container', function(e) {
            let name = $(this).attr('data-name'), 
                path = $(this).attr('data-path'), 
                useLib = Model.get('useLib');
            //
            pathList.push(name);
            self.lib[useLib].queryPage();
            e.stopPropagation();
        });
        //
        container.on('click', '.images-lib-list-nav span', function(e) {
            let index = $(this).attr('data-index');
            if (index === '-1') {
                pathList = [];
            } else {
                pathList.splice(parseInt(index) + 1);
            }
            //
            self.lib[Model.get('useLib')].queryPage();
            e.stopPropagation();
        });
        //
        container.find('.images-lib-usage').on('click', function() {
            let url = $(this).attr('data-url');
            window.open(url + Model.get('useLib'), "_blank");
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
            self.uploadImg(progressData, name, e.target.result, function(response) {
                console.log(response);
                //
                let content = response.content;
                $('.images-lib-list-inbox').prepend(self.view.getView('images', 'imageListItem', {
                    name: content.name,
                    url: content.download_url,
                    type: 'image'
                }));
                self.renderImage();
                //
                if (files.length > 0) {
                    
                    self.prepareUploadData(files, num + 1);
                } else {
                    isUploading = false;
                    // self.lib.load();
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
        xhr.addEventListener('error', ()=>{console.log('Upload failed.');}, false);
        xhr.onreadystatechange = function () {
            switch (xhr.readyState) {
                case 2:
                    xhr.responseType = 'json';
                    break;
                case 4:
                    if (xhr.status === 200 || xhr.status === 201) {
                        console.log('upload success');
                        callback(xhr.response);
                    } else {
                        self.module.component.notification('Upload failed.', 'danger');
                        console.log('upload failed');
                    }
                    break;
            }
        };
        //
        let useLib = Model.get('useLib');
        self.lib[useLib].upload(xhr, name, base64Data);
    };

    this.createFolder = function(name, base64Data, callback) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            switch (xhr.readyState) {
                case 2:
                    xhr.responseType = 'json';
                    break;
                case 4:
                    if (xhr.status === 200 || xhr.status === 201) {
                        callback(xhr.response);
                    } else {
                        self.module.component.notification('Create folder failed.', 'danger');
                    }
                    break;
            }
        };
        //
        let useLib = Model.get('useLib');
        self.lib[useLib].upload(xhr, name, base64Data);
    };
});
