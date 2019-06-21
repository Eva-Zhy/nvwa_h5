(function($){
    function Select(config){
        this.selecter=$('<div class="gg-m-select" style="display: none;"></div>');
        this.config=$.extend({
            data:[],
            patch:{
                height:40,
                width:30
            },
            container:$('body'),
            callback:null
        },config);
        if(!this.config.data instanceof Array){
            this.config.data=[this.config.data];
        }
        this.init();
    }

    Select.prototype.init=function(){
        this.build();
        this.bindEvent();
        this.initSelected();
        this.setValue();
    };
    Select.prototype.build=function(){
        this.config.container.append(this.selecter);
        this.buildFinish();
        this.buildArea();
        this.buildAction();
        this.buildShade();
    };
    Select.prototype.buildFinish=function(){
        var str='<div class="finish"><a>完成</a></div>';
        this.selecter.append(str);
        return str;
    };
    Select.prototype.buildArea=function(){
        var length=this.config.data.length;
        var width=100/length;
        var str='<div class="area">';
        var data=this.config.data;
        for(var i= 0,j=data.length;i<j;i++){
            str+='<ul style="width:'+width+'%;height: '+(data[i].options.length+4)*this.config.patch.height+'px;padding-top:'+2*this.config.patch.height+'px;';
            if(i==0 && data.length>1){
                str+='padding-left:'+width/6+'%;">';
            }else if(i==length-1 && data.length>1){
                str+='padding-right:'+width/6+'%;">';
            }else{
                str+='">';
            }
            for(var n= 0,m=data[i].options.length;n<m;n++){
                str+='<li gg-value="'+data[i].options[n].value+'">'+data[i].options[n].name+'</li>';
            }
            str+='</ul>'
        }
        str+='</div>';
        this.selecter.append(str);
        return str;
    };
    Select.prototype.buildAction=function(){
        var length=this.config.data.length;
        var width=100/length;
        var str='<div class="action">';
        for(var i= 0,j=this.config.data.length;i<j;i++){
            str+='<div style="width:'+width+'%;"></div>';
        }
        str+='</div>';
        this.selecter.append(str);
        return str;
    };
    Select.prototype.buildShade=function(){
        this.selecter.append('<div class="shade"><div class="cover-top"></div><div class="cover-content"></div><div class="cover-bottom"></div></div>');
    };
    Select.prototype.bindEvent=function(){
        var startTime=0;
        var y=0;
        var moveY=0;
        var that=this;
        for(var i=0,j=this.config.data.length;i<j;i++){
            $(this.config.data[i].select).on('touchstart',function(e){
                $('.gg-m-select').hide();
                that.initSelected();
                that.selecter.show();
                e.stopPropagation();
            });
        }
        this.selecter.on('touchstart','.action div',function(e){
            startTime=new Date().getTime();
            moveY=y= e.originalEvent.touches[0].pageY;
            e.stopPropagation();
        }).on('touchend','.action div',function(e){
            var t=new Date().getTime()-startTime;
            var s= e.originalEvent.changedTouches[0].pageY-y;
            that.slide(that.selecter.find('.area ul:eq('+$(this).index()+')'),t,s);
            e.stopPropagation();
        }).on('touchmove','.action div',function(e){
            that.slideMove(that.selecter.find('.area ul:eq('+$(this).index()+')'),e.originalEvent.changedTouches[0].pageY-moveY);
            moveY=e.originalEvent.changedTouches[0].pageY;
            e.preventDefault && e.preventDefault();
            e.stopPropagation && e.stopPropagation();
            return false;
        });
        this.selecter.on('touchstart','.finish a',function(e){
            that.config.callback(that.setValue());
            that.selecter.hide();
            e.preventDefault && e.preventDefault();
            e.stopPropagation && e.stopPropagation();
            return false;
        });
        this.selecter.on('touchmove','.finish',function(e){
            e.preventDefault && e.preventDefault();
            e.stopPropagation && e.stopPropagation();
            return false;
        });
    };
    Select.prototype.remove=function(){
        this.selecter.remove();
    };
    Select.prototype.slide=function(obj,t,s){
        var patchHeight=this.config.patch.height;
        var height=obj.innerHeight();
        var maxTop=height-5*patchHeight;
        var s1=s*200/t;
        var marginTop=parseInt(obj.css('margin-top').replace('px',''));
        var nMarginTop=marginTop;
        if(marginTop+s1>0){
            nMarginTop=0;
        }else if(marginTop+s1<-maxTop){
            nMarginTop=-maxTop;
        }else{
            nMarginTop=Math.ceil((marginTop+s1)/patchHeight)*patchHeight;
        }
        obj.animate({
            'margin-top':nMarginTop+'px'
        },300);
    };
    Select.prototype.slideMove=function(obj,s){
        var patchHeight=this.config.patch.height;
        var height=obj.innerHeight();
        var maxTop=height-5*patchHeight;
        var marginTop=parseInt(obj.css('margin-top').replace('px',''));
        var nMarginTop=marginTop;
        if(marginTop+s>0){
            nMarginTop=0;
        }else if(marginTop+s<-maxTop){
            nMarginTop=-maxTop;
        }else{
            nMarginTop=marginTop+s;
        }
        obj.css({
            'margin-top':nMarginTop+'px'
        });
    };
    Select.prototype.setValue=function(){
        var values=this.val();
        var arr=[];
        for(var i=0,j=values.length;i<j;i++){
            var data=this.config.data[i];
            $(data.select).html(data.options[values[i]].name).attr('gg-value',data.options[values[i]].value);
            arr.push({name:data.options[values[i]].name,value:data.options[values[i]].value});
        }
        return arr;
    };
    Select.prototype.val=function(){
        var values=[];
        var that=this;
        this.selecter.find('.area ul').each(function(){
            values.push(Math.abs($(this).css('margin-top').replace('px',''))/that.config.patch.height);
        });
        return values;
    };
    Select.prototype.initSelected=function(){
        var that=this;
        function getIndexOfArray(arr,v){
            for(var i=0,j=arr.length;i<j;i++){
                if(arr[i].value==v){
                    return i;
                }
            }
            return 0;
        }
        this.selecter.find('.area ul').each(function(i){
            $(this).css('margin-top',-getIndexOfArray(that.config.data[i].options,$(that.config.data[i].select).attr('gg-value'))*that.config.patch.height+'px');
        });
    };
    window.gg=window.gg || {};
    window.gg.Select=Select;
})(jQuery);