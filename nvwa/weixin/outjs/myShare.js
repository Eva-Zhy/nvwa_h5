(function($){
    function hex_sha1(a){return binb2hex(core_sha1(str2binb(a),a.length*chrsz))}function b64_sha1(a){return binb2b64(core_sha1(str2binb(a),a.length*chrsz))}function str_sha1(a){return binb2str(core_sha1(str2binb(a),a.length*chrsz))}function hex_hmac_sha1(a,b){return binb2hex(core_hmac_sha1(a,b))}function b64_hmac_sha1(a,b){return binb2b64(core_hmac_sha1(a,b))}function str_hmac_sha1(a,b){return binb2str(core_hmac_sha1(a,b))}function sha1_vm_test(){return"a9993e364706816aba3e25717850c26c9cd0d89d"==hex_sha1("abc")}function core_sha1(a,b){a[b>>5]|=128<<24-b%32,a[(b+64>>9<<4)+15]=b;for(var c=Array(80),d=1732584193,e=-271733879,f=-1732584194,g=271733878,h=-1009589776,i=0;i<a.length;i+=16){for(var j=d,k=e,l=f,m=g,n=h,o=0;80>o;o++){16>o?c[o]=a[i+o]:c[o]=rol(c[o-3]^c[o-8]^c[o-14]^c[o-16],1);var p=safe_add(safe_add(rol(d,5),sha1_ft(o,e,f,g)),safe_add(safe_add(h,c[o]),sha1_kt(o)));h=g,g=f,f=rol(e,30),e=d,d=p}d=safe_add(d,j),e=safe_add(e,k),f=safe_add(f,l),g=safe_add(g,m),h=safe_add(h,n)}return Array(d,e,f,g,h)}function sha1_ft(a,b,c,d){return 20>a?b&c|~b&d:40>a?b^c^d:60>a?b&c|b&d|c&d:b^c^d}function sha1_kt(a){return 20>a?1518500249:40>a?1859775393:60>a?-1894007588:-899497514}function core_hmac_sha1(a,b){var c=str2binb(a);c.length>16&&(c=core_sha1(c,a.length*chrsz));for(var d=Array(16),e=Array(16),f=0;16>f;f++)d[f]=909522486^c[f],e[f]=1549556828^c[f];var g=core_sha1(d.concat(str2binb(b)),512+b.length*chrsz);return core_sha1(e.concat(g),672)}function safe_add(a,b){var c=(65535&a)+(65535&b),d=(a>>16)+(b>>16)+(c>>16);return d<<16|65535&c}function rol(a,b){return a<<b|a>>>32-b}function str2binb(a){for(var b=Array(),c=(1<<chrsz)-1,d=0;d<a.length*chrsz;d+=chrsz)b[d>>5]|=(a.charCodeAt(d/chrsz)&c)<<32-chrsz-d%32;return b}function binb2str(a){for(var b="",c=(1<<chrsz)-1,d=0;d<32*a.length;d+=chrsz)b+=String.fromCharCode(a[d>>5]>>>32-chrsz-d%32&c);return b}function binb2hex(a){for(var b=hexcase?"0123456789ABCDEF":"0123456789abcdef",c="",d=0;d<4*a.length;d++)c+=b.charAt(a[d>>2]>>8*(3-d%4)+4&15)+b.charAt(a[d>>2]>>8*(3-d%4)&15);return c}function binb2b64(a){for(var b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",c="",d=0;d<4*a.length;d+=3)for(var e=(a[d>>2]>>8*(3-d%4)&255)<<16|(a[d+1>>2]>>8*(3-(d+1)%4)&255)<<8|a[d+2>>2]>>8*(3-(d+2)%4)&255,f=0;4>f;f++)c+=8*d+6*f>32*a.length?b64pad:b.charAt(e>>6*(3-f)&63);return c}var hexcase=0,b64pad="",chrsz=8,Signature=function(){this._jsapi_ticket=null,this._nonceStr=null,this._timeStamp=null,this._url=null,this._signature=null};Signature.prototype.genSign=function(a,b){this._url=b;var c={jsapi_ticket:a,nonceStr:this.createNonceStr(),timestamp:this.createTimeStamp(),url:b},d=this.raw(c);this._signature=hex_sha1(d)},Signature.prototype.createNonceStr=function(){return this._nonceStr=Math.random().toString(36).substr(2,15),this._nonceStr},Signature.prototype.createTimeStamp=function(){return this._timeStamp=parseInt((new Date).getTime()/1e3)+"",this._timeStamp},Signature.prototype.raw=function(a){var b=Object.keys(a);b=b.sort();var c={};b.forEach(function(b){c[b.toLowerCase()]=a[b]});var d="";for(var e in c)d+="&"+e+"="+c[e];return d=d.substr(1)};
    var wxapi = "http://h5tu.com/js/jweixin-1.0.0.js", qqapi = "http://h5tu.com/js/qqapi.js";
    function require(url, onload) {
        var doc = document;
        var head = doc.head || (doc.getElementsByTagName("head")[0] || doc.documentElement);
        var node = doc.createElement("script");
        node.onload = onload;
        node.onerror = function () {
        };
        node.async = true;
        node.src = url[0];
        head.appendChild(node)
    }

    var appid='wx642bfac3d22ca908';
    var sig=new Signature();
    var config={
        title: '', // ????????
        desc: '', // ????????
        link: window.location.href, // ????????
        imgUrl: '', // ???????
        type: '', // ????????,music??video??link??????????link
        dataUrl: ''// ????type??music??video??????????????????????
    };
    var wxManage={
        isInitComplete:false,
        init:function(){
            this.getTicket(this.run);
        },
        getTicket:function(callback){
            var that=this;
            $.ajax({
                url: 'http://huaxue.ifmoyu.com/chemist/server/weixin_share/refreshticket.php',
                type: 'get',
                crossDomain: true,
                dataType: 'jsonp',
                jsonp: "callback",
                jsonpCallback: 'wxGetTickCallback',
                success: function (res) {
                    if (res) {
                        sig.genSign(res.ticket, window.location.href);
                        require([wxapi], function () {
                            wx.config({
                                debug: false, // ??????????,?????????api??????????????alert????????????????????????????pc????????????????log??????????pc???????????
                                appId: appid, // ??????????��????
                                timestamp: sig._timeStamp, // ??????????????????
                                nonceStr: sig._nonceStr, // ???????????????????
                                signature: sig._signature, // ??????????????1
                                jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareQZone"] // ???????????JS????��???????JS????��??????2
                            });
                            wxManage.isInitComplete=true;
                            callback();
                        });
                    }
                    //else {
                    //    $.ajax({
                    //        url: 'http://huaxue.ifmoyu.com/chemist/server/weixin_share/refreshticket.php',
                    //        type: 'get',
                    //        crossDomain: true,
                    //        dataType: 'jsonp',
                    //        jsonp: "callback",
                    //        jsonpCallback: 'wxRefreshCallback',
                    //        success: function (res) {
                    //            callback();
                    //        }
                    //    });
                    //}
                }
            });
        },
        run:function(){
            if(wxManage.isInitComplete){
                wx.ready(function () {
                    wx.onMenuShareTimeline(config);
                    wx.onMenuShareAppMessage(config);
                    wx.onMenuShareQQ(config);
                    wx.error(function (v) {
                        wxManage.init();
                    });
                })
            }
            else{
                wxManage.init();
            }
        }
    };

    var qqManage={
        isInitComplete:false,
        init:function(){
            require([qqapi], function(){
                qqManage.isInitComplete=true;
                qqManage.run();
            });
        },
        run:function(){
            if(qqManage.isInitComplete){
                var info = {title: config.title, desc: config.desc, share_url: config.link, image_url: config.imgUrl};
                window.mqq.data.setShareInfo(info);
            }else{
                qqManage.init();
            }
        }
    };

    window.shareManage= {
        init: function (conf) {
            alert("init conf "+conf.link);
            $.extend(config, conf);
            var ua = navigator.userAgent;
            var isWX = ua.match(/MicroMessenger\/([\d\.]+)/), isQQ = ua.match(/QQ\/([\d\.]+)/);
            isWX && wxManage.run();
            isQQ && qqManage.run();
        }
    };

})(jQuery);

