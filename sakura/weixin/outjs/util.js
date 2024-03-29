(function(){
    window.gg= window.gg || {};
    gg.util={
        setCache:function(key,value,type){
            if(typeof value==='object'){
                value=JSON.stringify(value);
            }
            switch(type){
                case 'sessionStorage':sessionStorage.setItem(key,value);break;
                case 'localStorage':localStorage.setItem(key,value);break;
                default:sessionStorage.setItem(key,value);
            }
        },
        getCache:function(key){
            var value=sessionStorage.getItem(key) || localStorage.getItem(key);
            try{
                return JSON.parse(value);
            }catch(e){
                return value;
            }
        },
        clearCache:function(){
            sessionStorage.clear();
            localStorage.clear();
        },
        pageScroll:function(){
            var times=setInterval(function(){
                window.scrollBy(0,-50);
                if(document.documentElement.scrollTop==0 && document.body.scrollTop==0){
                    clearInterval(times);
                }
            },20);
        },
        getUrlParam:function(){
            var obj={};
            var paramStr=location.search.split('#')[0].split('?')[1];
            if(paramStr){
                var params=paramStr.split('&');
                for(var i= 0,j=params.length;i<j;i++){
                    var arr=params[i].split('=');
                    obj[arr[0]]=arr[1];
                }
            }
            return obj;
        },
        formatDate:function(date,sp){
            var month=date.getMonth()+1;
            month=month<10?('0'+month):month;
            if(sp){
                return date.getFullYear()+sp+month+sp+date.getDate();
            }else{
                return ''+date.getFullYear()+month+date.getDate();
            }
        },
        browserVersion:function(){

            var u = navigator.userAgent || navigator.appVersion;
            return {//移动终端浏览器版本信息
                trident: navigator.userAgent.indexOf('Trident') > -1, //IE内核
                presto: navigator.userAgent.indexOf('Presto') > -1, //opera内核
                webKit: navigator.userAgent.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1, //火狐内核
                mobile: !!navigator.userAgent.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: navigator.userAgent.indexOf('iPhone') > -1 || navigator.userAgent.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                iPad: navigator.userAgent.indexOf('iPad') > -1, //是否iPad
                webApp: navigator.userAgent.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                wx:navigator.userAgent.toLowerCase().match(/MicroMessenger/i)=="micromessenger"//微信
            };
        }()
    }
})();
