# CEF - A simple Chrome Extension development falsework

CEF是一个简单的Chrome Extension开发脚手架，它有如下功能：
1. 模块化的结构，便于开发维护
2. 支持模板
3. 支持简单的数据绑定
4. 发布工具，可对JS文件进行压缩，并输出干净的扩展文件

### 目录

- [1. 获取并初始化](#1获取并初始化)
- [2. 项目结构](#2项目结构)
- [3. 使用](#3使用)
    - [3.1 创建Module](#31创建Module)
    - [3.2 创建View](#32创建View)
        - [3.2.1 getView()](#321getView)
        - [3.2.2 display()和append()](#322display和append)
        - [3.2.3 模板语法](#323模板语法)
    - [3.3 创建Event](#33创建Event)
    - [3.4 发布](#34发布)
        - [3.4.1 设置过滤](#341设置过滤)
    - [3.5 加载文件](#35加载文件)


## 1.获取并初始化
1. git clone https://github.com/yuiitsu/CEF.git
2. cd CES
3. npm install

## 2.项目结构
```
- dist // 发布文件夹
- scripts
  - lib // 库文件夹
    jquery.js
  - module // 模块
    - your module
        event.js // 事件监听
        module.js // 模块功能
        view.js // 模板
  app.js
  model.js
  run.js
- style
deploy.js // 发布脚本
manifest.json
```

> 注：本项目默认使用jQuery作为dom selector

## 3.使用
### 3.1创建Module
在module文件夹里创建Module文件夹，如：demo。接着在demo文件夹里创建module.js，event.js和view.js，

> 注：这3个文件并不是必须的，根据情况添加。比如，该模块并不需要模板，所以view.js就可以不要

在module.js中添加如下代码：
```javascript
App.module.extend('demo', function() {
    //
    this.init = function() {
        // todo.
    };
});
```
extend的第一个参数为模块名，如果加载了该模块，可以在module, event, view里直接使用`this.module.demo`调用。
init方法为初始化方法，模块加载的时候即会执行。

接着添加一个方法：
```javascript
App.module.extend('demo', function() {
    //
    this.init = function() {
        // todo.
    };
    
    this.hello = function() {
        console.log('Module demo hello.');
    };
});
```
如下调用hello方法：
```javascript
this.module.demo.hello();
```

### 3.2创建View
在demo文件夹下的view.js里添加如下代码：
```javascript
App.view.extend('demo', function() {
    this.hello = function() {
        return `
            <div class="ces-view-example">
                <h1>CES View Example</h1>
                <div>Hi, {{ data['name'] }}</div>
            </div>
        `;
    };
});
```
同Module，extend第一个参数为view名称，hello方法返回一段html模板代码。view对象有3个方法，分别是：

- getView()
- display()
- append()

#### 3.2.1getView()
```javascript
function getView(name, method, data) {}
```
它有3个参数：

- name，view名称
- method, 方法名称
- data, 渲染数据

调用demo的hello方法：
```javascript
let html = this.view.getView('demo', 'hello', {name: 'CEF'});
```
将会得到：
```html
<div class="ces-view-example">
    <h1>CES View Example</h1>
    <div>Hi, CEF</div>
</div>
```

#### 3.2.2display()和append()
这两个方法很明显，输出HTML到指定位置用的，参数相同
```javascript
function display(name, method, data, target) {}
```
它们有4个参数，前3个同getView，最后的target即为目录对象，因为本项目使用了jQuery，所以这里是jQuery对象
调用：
```javascript
this.view.display('demo', 'hello', {name: 'CEF'}, $('#xxx'));
```

#### 3.2.3模板语法
```
// 变量附值
{{ var v = 1; }}

// 变量输出
{{ v }}

// 条件
{{ if v === 1 }}
// todo.
{{ else }}
// todo.
{{ end }}

// 循环
{{ var list = [1, 2] }}
{{ for var i in list }}
    {{ list[i] }}
{{ end }}

// 调用其它模板
{{ var v = this.view.getView(); }}

// 渲染模板
{{ v }}
```

### 3.3创建Event
在demo文件夹的event.js里添加如下代码：
```javascript
App.event.extend('demo', function() {
    this.event = {
        listenExample: function() {
            // listen event
        }
    }
});
```
和之前一样，只是event只有一个默认的对象，this.event，当event.js被加载的时候，系统会自动执行this.event里的所有方法，不需要再手动执行监听了。
在event.js里同样可以使用`this.module`和`this.view`来调用module或view，但建议只调用module，渲染的工作交到它。

### 3.4发布
发布脚本可以去除项目目录下不需要的文件夹和文件，将对js文件进行压缩混淆。命令如下：
```
node deploy.js
```

#### 3.4.1设置过滤
不需要发布的文件夹或文件，不需要压缩混淆的文件可以在deploy.js里配置
```javascript
let excludes = {
    'copy': [
        '.gitignore',
        '.DS_Store',
        'builder.js',
        'package.json',
        'package-lock.json',
        'README.md',
        '.git',
        '.idea',
        'node_modules',
        'dist'
    ],
    'mini': [
    ]
};
```
其中excludes.copy为不需要发布的文件夹和文件，mini为不需要压缩混淆的文件

发布执行完成后，文件输出到dist文件夹，只需要将dist目录打包，上传Chrome Extension Store即可。

### 3.5加载文件
目前新增Module里的文件需要手动添加到manifest.json或是html文件里，后续会增加编译自动执行。因为考虑到可能的因素过多，
配置的代理可能会非常多，所以手动添加是目前比较好的处理方式。