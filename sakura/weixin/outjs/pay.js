(function($){
    window.gg=window.gg || {};
    if(!window.gg.util){
        $('body').append('<script src="../outjs/util.js"></script>');
    }

    window.gg.pay=function(fee,openid,callback){
        var param=window.gg.util.getUrlParam();
        $.get('http://case.h5tu.com/pay/wx/example/pay_wx.php', {
            fee: fee,
            openid: openid,
            project: param.project
        }, function (res) {
            function jsApiCall() {
                WeixinJSBridge.invoke('getBrandWCPayRequest', res, function (result) {
                    console.log(result);
                    if (result.err_msg == "get_brand_wcpay_request:ok") {
                        callback({ret: 0, msg: '成功'});
                    } else if (result.err_msg == "get_brand_wcpay_request:cancel") {
                        callback({ret: 1, msg: '取消'});
                    } else {
                        callback({ret: 2, msg: '失败'});
                    }
                });
            }

            if (typeof WeixinJSBridge == "undefined") {
                if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
                } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady', jsApiCall);
                    document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
                }
            } else {
                jsApiCall();
            }
        }, 'json');
    };
})(jQuery);