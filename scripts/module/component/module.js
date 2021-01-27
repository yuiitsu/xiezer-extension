/**
 * Created by onlyfu on 2017/9/6.
 */
App.module.extend('component', function() {

    let self = this;
    //
    // Model.default['requestXHR'] = {};

    this.init = function() {
        //
        //
        // Model.set('requestXHR', Model.default.requestXHR);
    };

    this.is_function = function(str) {
        return Object.prototype.toString.call(str) === '[object Function]';
    };

    this.object_is_empty = function(obj) {
        for (let i in obj) {
            return false;
        }
        return true;
    };

    this.timeToStr = function(timestamp) {
        if (!timestamp) {
            timestamp = new Date().getTime();
        }
        let date = new Date(parseInt(timestamp)), 
            year = date.getFullYear(), 
            month = date.getMonth() + 1, 
            d = date.getDate(), 
            h = date.getHours(), 
            m = date.getMinutes(), 
            s = date.getSeconds();
        //
        return year + '-' 
            + (month < 10 ? '0' + month : month) 
            + '-' 
            + (d < 10 ? '0' + d : d) 
            + ' ' 
            + (h < 10 ? '0' + h : h) 
            + ':' 
            + (m < 10 ? '0' + m : m) 
            + ':' 
            + (s < 10 ? '0' + s  : s);
    };

    this.encodeHtml = function(s){
        let REGX_HTML_ENCODE = /“|&|’|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g;
        return (typeof s != "string") ? s :
            s.replace(REGX_HTML_ENCODE,
                      function($0){
                          var c = $0.charCodeAt(0), r = ["&#"];
                          c = (c == 0x20) ? 0xA0 : c;
                          r.push(c); r.push(";");
                          return r.join("");
                      });
    };

    /**
     * 提示
     * @param focus
     * @param content
     * @param options
     */
    this.tips = {
        timer: null,
        show: function(focus, content, options, parent, e) {
            let _this = this;
            let opt = options || {};
            let obj = $('#tips-box');

            obj.remove();
            container = parent || $('body');
            container.append(self.view.getView('component', 'tips', {
                content: content
            }));
            obj = $('#tips-box');

            // 宽度
            if (opt.width) {
                obj.css({'width': opt.width});
            }
            // 高度
            if (opt.height) {
                obj.css({'height': opt.height});
            }

            if (this.timer) {
                clearTimeout(this.timer);
            }

            focus.off('mouseleave').on('mouseleave', function() {
                _this.timer = setTimeout(function() {
                    $('#tips-box').remove();
                }, 300);
            });

            let focus_offset = focus.offset(),
                focus_width = focus.outerWidth(),
                focus_height = focus.outerHeight(),
                focus_top = parent ? focus_offset.top : e.clientY,
                focus_left = parent ? focus_offset.left : e.clientX,
                target_width = obj.outerWidth(),
                target_height = obj.outerHeight(),
                client_width = self.clientSize('clientWidth'),
                client_height = self.clientSize('clientHeight'),
                arr_obj = $('.tips-array');

            switch (opt.position) {
                case "left":
                    focus_left = focus_left - target_width <= 0 ? focus_left + focus_width : focus_left - target_width;
                    if (focus_top + target_height > client_height) {
                        focus_top = focus_top - target_height;
                    }
                    break;
                case "right":
                    arr_obj.removeClass('tips-array-right tips-array-top tips-array-bottom').addClass('tips-array-left');
                    focus_left = focus_left + target_width > client_width ? focus_left - focus_width - target_width : focus_left + focus_width + 8;
                    if (focus_top + target_height > client_height) {
                        focus_top = client_height - target_height;
                        arr_obj.css('top', target_height - 24);
                    } else {
                        arr_obj.css('top', 8)
                    }

                    break;
                default:
                    if (parent) {
                        if (focus_left + target_width > client_width) {
                            focus_left = focus_left - target_width + focus_width;
                            focus_top = focus_top + focus_height;
                            arr_obj.css('right', 13);
                        } else {
                            arr_obj.css('left', 8);
                        }
                        arr_obj.removeClass('tips-array-left tips-array-right tips-array-bottom').addClass('tips-array-top');
                        focus_top = focus_top + focus_height;
                    }

                    // 检查位置和调试，如果超出屏幕，向上显示
                    if (focus_top + target_height > client_height) {
                        focus_top = focus_top - target_height - focus_height;
                        arr_obj.removeClass('tips-array-left tips-array-right tips-array-top').addClass('tips-array-bottom');
                        arr_obj.css({'bottom':-8});
                    }
                    break;
            }

            obj.css({'top': focus_top, 'left': focus_left})
                .off('mouseenter').on('mouseenter', function() {
                    clearTimeout(_this.timer);
            }).off('mouseleave').on('mouseleave', function() {
                $(this).remove();
            });
        },
        remove: function() {
            $('#tips-box').remove();
        }
    };

    /**
     * 通知
     * @param text
     * @param type
     */
    this.notification = function(text, type) {
        // 初始化
        let notification_timer = null;
        $('#notification-box').remove();
        clearTimeout(notification_timer);
        //
        if (typeof text !== 'string') {
            type = text.type;
            text = text.msg;
        }
        //
        let bg = type ? type : 'success';
        $('body').append(self.view.getView('component', 'notification', {
            text: text,
            bg: bg
        }));

        notification_timer = setTimeout(function() {
            $('#notification-box').fadeOut();
        }, 3000);
    };

    /**
     * module
     * @param options
     *  options.name
     *  options.width
     *  options.
     * @param content
     * @param action
     */
    this.module = function(options, content, action) {
        let module_id = Date.parse(new Date()),
            containerParent = options.container ? options.container : $('body');

        containerParent.append(this.view.getView('component', 'module', {
            name: options.name,
            content: content,
            action: action,
            module_id: module_id,
            noClose: options.noClose
        }));

        let container = $('.module-box-' + module_id);
        container.find('.js-handler').attr('data-module-id', module_id);
        if (options.width) {
            container.find('.xiezer-module-content').css({width: options.width});
        }

        // 检查高度
        let target = $('.module-main');
        let target_height = target.outerHeight();
        // let content_height = target_height + 90 > 600 ? '600px' : target_height + 100;
        //$('.module-content').css('height', content_height);
        //target.css('height', target_height);

        if (!options.noClose) {
            container.find('.xiezer-module-close').off('click').on('click', function() {
                // let module_id = $(this).attr('data-module-id');
                $('.module-box-' + module_id).remove();
            });

            container.find('.xiezer-module-mask').off('click').on('click', function() {
                let module_id = $(this).attr('data-module-id');
                $('.module-box-' + module_id).remove();
            });
        }
        //
        Model.set('currentModuleComponent', container);
        return container;
    };

    /**
     * 对话框
     * @returns {{confirm: confirm, ok: ok}}
     */
    this.dialog = function() {
        return {
            show: function(type, title, msg, confirm_callback, cancel_callback) {
                let dialog_id = Date.parse(new Date());
                $('html').append(self.view.getView('component', 'dialog', {
                    type: type,
                    title: title,
                    msg: msg,
                    dialog_id: dialog_id
                }));

                $('.xiezer-dialog-close').off('click').on('click', function() {
                    let dialog_id = $(this).attr('data-dialog-id');
                    $('.dialog-' + dialog_id).remove();
                    if (self.is_function(cancel_callback)) {
                        cancel_callback();
                    }
                });

                $('.xiezer-dialog-action-button').off('click').on('click', function() {
                    let dialog_id = $(this).attr('data-dialog-id'),
                        data_type = $(this).attr('data-type');
                    $('.dialog-' + dialog_id).remove();

                    if (data_type === 'confirm') {
                        if (self.is_function(confirm_callback)) {
                            confirm_callback();
                        }
                    } else {
                        if (self.is_function(cancel_callback)) {
                            cancel_callback();
                        }
                    }
                });
            },
            confirm: function(msg, title, confirm_callback, cancel_callback) {
                this.show('confirm', title, msg, confirm_callback, cancel_callback);
            },
            ok: function(msg, title, confirm_callback, cancel_callback) {
                this.show('ok', title, msg, confirm_callback, cancel_callback);
            }
        }
    };

    /**
     * 发起请求
     * @param url 请求地址
     * @param params 请求类型
     * @param data 请求数据
     * @param callBack 回调函数
     * @param is_form_data
     */
    this.request = function(url, params, data, callBack, is_form_data){
        let request_type = params.type ? params.type : "GET";
        let xhr = new XMLHttpRequest();
        xhr.addEventListener('readystatechange', function() {
            switch (this.readyState) {
                case 1:
                    break;
                case 2:
                    self.get_response_content_type(this.getResponseHeader('content-type'), function(type) {
                        switch (type) {
                            case 'json':
                                xhr.responseType = 'json';
                                break;
                            case 'img':
                                //if (xhr.getResponseHeader('accept-ranges') === 'bytes') {
                                    xhr.responseType = 'blob';
                                //}
                        }
                    });
                    break;
                case 3:
                    break;
                case 4:
                    if (self.is_function(callBack)) {
                        callBack(this.response, this);
                    }
                    break;
            }
        });

        // 构造数据
        let send_data = null;
        if (request_type === 'GET') {
            url += url.indexOf('?') === -1 ? '?' : '&';
            if (typeof data === 'object') {
                send_data = [];
                for (let i in data) {
                    if (data.hasOwnProperty(i)) {
                        send_data.push(i + '=' + data[i])
                    }
                }
                url += encodeURI(send_data.join('&'))
            }
        } else {
            if (!is_form_data) {
                send_data = [];
                for (let i in data) {
                    if (data.hasOwnProperty(i)) {
                        send_data.push(i + '=' + data[i])
                    }
                }
                send_data = encodeURI(send_data.join('&'));
            } else {
                send_data = data;
            }
        }

        xhr.open(request_type, url, params.async !== 'false');
        // set headers
        if (params.headers) {
            let headers_tmp = [];
            for (let i in params.headers) {
                if (params.headers.hasOwnProperty(i)) {
                    let header_key = i;
                    header_key = header_key.toLowerCase();
                    if (headers_tmp.indexOf(header_key) === -1) {
                        xhr.setRequestHeader(i, params.headers[i]);
                        headers_tmp.push(header_key);
                    }
                }
            }
        }

        // 请求失败
        xhr.addEventListener('error', function() {
            console.log('request error.');
        });

        xhr.send(send_data);
        //
        return xhr;
    };

    /**
     * ajax object
     */
    this.requestXHR = {
        add: function(k, v) {
            let xhr = Model.get('requestXHR');
            if (xhr && xhr.hasOwnProperty(k)) {
                xhr[k].abort();
            }
            xhr[k] = v;
        },
        abort: function(k) {
            let xhr = Model.get('requestXHR');
            if (xhr.hasOwnProperty(k)) {
                try {
                    xhr[k].abort();
                } catch(e) {
                    console.log(e);
                }
            }
        }
    };

    /**
     * 检查response的content_type类型
     * @param content_type
     * @param callback
     * @private
     */
    this.get_response_content_type = function(content_type, callback) {
        if (content_type) {
            if (content_type.indexOf('application/json') !== -1) {
                callback('json');
            } else if (content_type.indexOf('image') !== -1) {
                callback('img');
            } else if (content_type.indexOf('text/xml') !== -1 || content_type.indexOf('application/xml') !== -1) {
                callback('xml');
            } else if (content_type.indexOf('text/html') !== -1) {
                callback('html');
            }
        } else {
            callback('');
        }
    };

    /**
     * 屏幕/文档/滚动宽高
     * @param type 类型
     */
    this.clientSize = function(type) {
        let result = [];
        result['scrollTop'] = window.self.document.documentElement.scrollTop ?
            window.self.document.documentElement.scrollTop : window.self.document.body.scrollTop;
        result['scrollHeight'] = window.self.document.documentElement.scrollHeight ?
            window.self.document.documentElement.scrollHeight : window.self.document.body.scrollHeight;
        result['clientHeight'] = window.self.document.documentElement.clientHeight ?
            window.self.document.documentElement.clientHeight : window.self.document.body.clientHeight;
        result['clientWidth'] = window.self.document.documentElement.clientWidth ?
            window.self.document.documentElement.clientWidth : window.self.document.body.clientWidth;
        return result[type];
    };

    /**
     * MD5
     * @param string
     * @returns {string}
     */
    this.md5 = function(string) {
        function RotateLeft(lValue, iShiftBits) {
            return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
        }

        function AddUnsigned(lX,lY) {
            var lX4,lY4,lX8,lY8,lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
            if (lX4 & lY4) {
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            }
            if (lX4 | lY4) {
                if (lResult & 0x40000000) {
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                } else {
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                }
            } else {
                return (lResult ^ lX8 ^ lY8);
            }
        }

        function F(x,y,z) { return (x & y) | ((~x) & z); }
        function G(x,y,z) { return (x & z) | (y & (~z)); }
        function H(x,y,z) { return (x ^ y ^ z); }
        function I(x,y,z) { return (y ^ (x | (~z))); }

        function FF(a,b,c,d,x,s,ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function GG(a,b,c,d,x,s,ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function HH(a,b,c,d,x,s,ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function II(a,b,c,d,x,s,ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function ConvertToWordArray(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWords_temp1=lMessageLength + 8;
            var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
            var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
            var lWordArray=Array(lNumberOfWords-1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while ( lByteCount < lMessageLength ) {
                lWordCount = (lByteCount-(lByteCount % 4))/4;
                lBytePosition = (lByteCount % 4)*8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
            lWordArray[lNumberOfWords-2] = lMessageLength<<3;
            lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
            return lWordArray;
        };

        function WordToHex(lValue) {
            var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
            for (lCount = 0;lCount<=3;lCount++) {
                lByte = (lValue>>>(lCount*8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
            }
            return WordToHexValue;
        };

        function Utf8Encode(string) {
            string = string.replace(/\r\n/g,"\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        };

        var x=Array();
        var k,AA,BB,CC,DD,a,b,c,d;
        var S11=7, S12=12, S13=17, S14=22;
        var S21=5, S22=9 , S23=14, S24=20;
        var S31=4, S32=11, S33=16, S34=23;
        var S41=6, S42=10, S43=15, S44=21;

        string = Utf8Encode(string);

        x = ConvertToWordArray(string);

        a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

        for (k=0;k<x.length;k+=16) {
            AA=a; BB=b; CC=c; DD=d;
            a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
            d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
            c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
            b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
            a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
            d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
            c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
            b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
            a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
            d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
            c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
            b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
            a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
            d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
            c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
            b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
            a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
            d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
            c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
            b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
            a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
            d=GG(d,a,b,c,x[k+10],S22,0x2441453);
            c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
            b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
            a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
            d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
            c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
            b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
            a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
            d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
            c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
            b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
            a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
            d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
            c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
            b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
            a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
            d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
            c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
            b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
            a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
            d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
            c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
            b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
            a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
            d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
            c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
            b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
            a=II(a,b,c,d,x[k+0], S41,0xF4292244);
            d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
            c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
            b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
            a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
            d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
            c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
            b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
            a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
            d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
            c=II(c,d,a,b,x[k+6], S43,0xA3014314);
            b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
            a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
            d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
            c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
            b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
            a=AddUnsigned(a,AA);
            b=AddUnsigned(b,BB);
            c=AddUnsigned(c,CC);
            d=AddUnsigned(d,DD);
        }

        var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

        return temp.toLowerCase();
    }
});
