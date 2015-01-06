/*
*  Tanımlamalar 
* 
*/

var inputTimers = Array();
/*
var options = {
zoomType: 'standard',
lens:true,
preloadImages: true,
alwaysOn:false,
zoomWidth: 495,
zoomHeight: 345,
xOffset:2,
yOffset:0,
title:false,
preloadText:'Yükleniyor...'
};
*/
var options = {
    zoomWidth: 495,
    zoomHeight: 345,
    xOffset:10,
    yOffset:0,
    preloadText: 'Yükleniyor..',
    showEffect : 'fadein'
};

$(document).ready(function(){
        $("form[class!=ns]").jqTransform();
        $("form[rel!=no]").validationEngine({promptPosition:"topRight",scroll: false});
        $("#searcharea").validationEngine({promptPosition:"bottomLeft",scroll: false});

        $('.lazy').lazyload({ 
                effect : "fadeIn"
        });
        $(".zooms").jqzoom(options);

        $('#multizoom2').addimagezoom({
                cursorshade: true,
                disablewheel: true,
                magnifiersize: [495,345]
        })
        /*
        $("#smpic li a").click(function(){
        ChangeProductPic(jQuery(this).attr('rel'),jQuery(this).attr('w')); 
        $('.zooms').trigger('changeimage');  
        });                                              
        */

        $("a[rel^='pretty']").prettyPhoto({animationSpeed:'slow',theme:'facebook',slideshow:5000, autoplay_slideshow: true});
        $("a[rel^='pframe']").prettyPhoto({animationSpeed:'slow',theme:'facebook',slideshow:5000, autoplay_slideshow: false});


        var offset = $("#shopping_cart").offset();
        var topPadding = 135;
        $(window).scroll(function() {
                if ($(window).scrollTop() > offset.top) {
                    $("#shopping_cart").stop().animate({marginTop: $(window).scrollTop() - offset.top + topPadding, marginRight: -76});
                }
                else {
                    $("#shopping_cart").stop().animate({marginTop: 6, marginRight: 12});
                };

                if ($(this).scrollTop() > 150) {
                    $('#back-top').fadeIn();
                    $('#catList').addClass('fixed');
                } else {
                    $('#back-top').fadeOut();
                    $('#catList').removeClass('fixed');
                }
        });
        $('#back-top a').click(function () {
                $('body,html').animate({
                        scrollTop: 0
                    }, 800);
                return false;
        });

        $('.tabhead > ul > li > a').live('click',function(){
                var rel = $(this).attr('rel');
                var thisDiv = $(this).parent().parent().parent().parent();
                thisDiv.children('.tabbody').hide();
                thisDiv.children('#'+rel).show();
                $(this).parent().parent().find('a').removeClass('active');
                $(this).addClass('active');
        });

        $(".account[lang!=nok]").live('click',function(e){
                e.preventDefault();    

                //console.log($(this).parent().siblings("div:has(div.account)").find(".cartBox")[0]);
                $(this).parent().parent().find(".cartBox").slideUp(500);
                $(this).parent().find(".cartBox").slideToggle(500);
        });

        $('.allCategories li').mouseover(function(){
                $(this).children('ul').show();
        });

        $('.allCategories li').mouseout(function(){
                $(this).children('ul').hide();
        });
        $('.menu1 li').mouseover(function(){
                $(this).children('ul').show();
        });

        $('.menu1 li').mouseout(function(){
                $(this).children('ul').hide();
        });
        sepetOku();

        $('#smpic').cycle({
                fx:'scrollVert',
                continuous:0,
                timeout:0
        });

});
function readComment() {
    $('.tabhead > ul > li > a').removeClass('active');
    $('.tabbody').hide();
    $('#procomment').show();
    $('a[rel="procomment"]').addClass('active');
}
function sames(v) {
    if($(v).attr('checked')=='checked') {
        $('#bireysel_name').val($('#bill_name').val());
        $('#bireysel_tckimlik').val($('#bill_tckimlik').val());
        $('#bireysel_mobile').val($('#bill_mobile').val());
        $('#bireysel_address').val($('#bill_address').val());
        $('#bireysel_state').val($('#bill_state').val());
        $('#bireysel_city').val($('#bill_city').val());
    }
    else
        {
        $('#bireysel_name').val('');
        $('#bireysel_tckimlik').val('');
        $('#bireysel_mobile').val('');
        $('#bireysel_address').val('');
        $('#bireysel_state').val('');
        $('#bireysel_city').val('');
    }
}
function liveFunc() {
    $('form[step!="cout"]').bind('submit',function(){
            //console.log(this);
            nextStep($(this).attr('step'),this);
            return false;
    });
}
function nextStep(action,vthis){

    $('form').validationEngine('detach');
    $('form').validationEngine('attach',{promptPosition:"topRight",scroll: false});
    var cartThree = true;
    var form = $(vthis).serialize();
    if(action=='cartThree') {
        form = form+'&'+$('#bill_adres').serialize();
        if(!$('#bill_adres').validationEngine('validate')){
            cartThree = false;
        }
    }
    if($(vthis).validationEngine('validate') && cartThree) {
        $.post('execute.php',form,function(data){
                var json = eval('('+data+')');
                if(!json.hata) {
                    $('form').validationEngine('hideAll');
                    $('#information').html('');
                    $('#'+action).children('.account').removeAttr('lang');
                    $('#'+action).children('.cartBox').html(json.tmp);
                    $('#'+action).children('.account').click();

                    $("#cardholder").validationEngine({promptPosition:"topRight",scroll: false});
                    liveFunc();
                }
                else message(json.hata,'error');

        });
    }
    liveFunc();

}


function gotoLink(vthis) {
    top.location.href=vthis.value;
}
function sepetOku(){
    $.post('addCart.php', {'action':'showCart'}, function(data) {
            $("#mycart").html(data);
    });
}
function removePro(id) {
    $.post('addCart.php',{'action':'deletepro','id':id},function() {
            sepetOku();
    })
}
function sepeteEkle(id,adet,fast) {
    var uid = id;
    var sepet = 'action=add&adet='+adet+'&uid='+uid;
    var modeller = $("#modelleme").serialize();
    if(modeller != 'undefined') {
        sepet = sepet+'&'+modeller;
    }
    if((!$('#prodct')[0] || $('#prodct').validationEngine('validate')) && (!$('#modelleme')[0] || $('#modelleme').validationEngine('validate')))
        jQuery.post('addCart.php', sepet, function(data) {

            result = eval('(' + data + ')');

            $('#totalBasket').html('<a href="sepet.html">'+result.totalBasket+'</a>');
            $('#totalBasketSpan').html(result.totalBasket);
            $('#totalPrice').html(result.totalPrice);
            var types = (result.noStock) ? { theme: 'growl-error', life: 2000,position:'bottom-right' }:{ theme: 'growl-success', life: 2000,position:'bottom-right' };
            $.jGrowl(result.resultText,types);
            sepetOku();
            if(fast && result.noStock!=1) top.location.href = 'sepet.html';
            $('.overlay').show().center();
            $('.overlay_con').show().center();
            setTimeout("hidePop()",1000);
    });
}

function miktarChange(vthis,key,cart) {
    var change=true;
    var max = $(vthis).attr('max');
    var value = parseInt($(vthis).val());
    if(value > max) { value=max; change=false; $("#m"+key).val(value);}
    if(value<1) { value=1; change=false; $("#m"+key).val(value); }
    if(change && cart) changeAmount(value,key);
}
function upAmount(key,cart) {
    var input = $("#m"+key).val();
    input =parseInt(input)+1;
    var maxi = $("#m"+key).attr('max');
    if(maxi < 1) maxi = 1;
    if(input>maxi)  {  input = maxi; }
    else {
        if(cart) changeAmount(input,key);
    }
    $("#m"+key).val(input);
    $("#mk"+key).html(input);
}

function downAmount(key,cart) {
    var input = $("#m"+key).val();
    input = parseInt(input)-1;
    if(input<1) { input = 1;  }
    else {
        if(cart) changeAmount(input,key);
    }
    $("#m"+key).val(input);
    $("#mk"+key).html(input);
}
function changeAmount(value,key) {
    $.post('addCart.php',{'action':'amountchange','key':key,'input':value},function(data){
            var json = eval('('+data+')');
            $('#p'+key).html(json.price);
            $('#k'+key).html(json.kdv);
            $('#t'+key).html(json.total);
            $('#mk'+key).html(json.amount);
            $('#m'+key).val(json.amount);
            $('#totalPriceCart').html(json.totalPrice);
            $('#totalPrice').html(json.totalPrice);
            $('#kdvPriceCart').html(json.kdvPrice);
            $('#genelPriceCart').html(json.genelPrice);
            $('#havalePriceCart').html(json.havalePrice);
    });
}
function addresChange(vthis,myself){
    var val = $(vthis).val();
    if(val=='new'){
        $(vthis).parents('form').find('input[type!=submit][class!="nojs"]').attr('value','').removeAttr('disabled');
    }
    else
        {
        var type = $(vthis).attr('rel');
        $.post('addCart.php',{'action':'getaddres','type':type,'val':val},function(data){
                var json = eval('('+data+')');
                if(json.hata){
                    message(json.hata,'error');
                }
                else
                    {
                    if(myself!=true)
                        $(vthis).parents('form').find('input[type!=submit][class!="nojs"]').attr('disabled','disabled');
                    $("#"+type+"_name").val(json.name);
                    $("#"+type+"_mobile").val(json.mobile);
                    $("#"+type+"_address").val(json.address);
                    $("#"+type+"_state").val(json.state);
                    $("#"+type+"_city").val(json.city);
                    $("#"+type+"_tckimlik").val(json.tckimlik);
                    $("#"+type+"_vd").val(json.tax_vd);
                    $("#"+type+"_no").val(json.tax_no);
                }
        });
    }
}
function changeBankText(id)
{
    $.post('addCart.php',
        {'action':'bankText','b':id},
        function(data)
        {
            $('#bInfo').html(data);
    });
}
function choosePayment(v) {
    $.post('addCart.php',
        {'action':'paymentMethod','type':v.value},
        function(data)
        {
            $('#paymentResult').html(data);
            if(v.value=='creditcard')
                $("#pymnts").validationEngine({promptPosition:"topRight",scroll: false});
    });
}
function changeBank(me)
{
    var value = $(me).val();
    var _3d = $(me).attr('d3');

    if(_3d==1) {
        //console.log('3D Secure');
    }
    if(value!='')
        {
        $.post('addCart.php',
            {'action':'instalment','b':value},
            function(data)
            {
                $("#instalment").html(data); 
        });
    }
    else
        {
        $("#instalment").html('');  
    }
    return false;
}
function invoiceBTN(area){
    if(area=='bireysel'){
        $('#bireyselfatura').show();
        $('#kurumsalfatura').hide();
        $('.bireysel a').addClass('current');
        $('.corparate a').removeClass('current');
        $('#ftype').val(1);
    } else {
        $('#bireyselfatura').hide();
        $('#kurumsalfatura').show();
        $('.bireysel a').removeClass('current');
        $('.corparate a').addClass('current');
        $('#ftype').val(2);
    }    
}
function message(text,clas) {
    switch(clas) {
        case 'success':
            c = 'nSuccess';
            break;
        case 'error':
            c = 'nFailure';
            break;
        case 'info':
            c = 'nInformation';
            break;
        case 'waring':
            c = 'nWarning';
            break;
    }

    var message = '<div class="nNote '+c+'"><p><strong>'+text+'</strong></p></div>';
    $('#information').html(message);
}
function hidePop() {
    $('.overlay').hide();
    $('.overlay').css('filter','alpha(opacity=80)');
    $('.overlay_con').hide();
}
function showValues(G) {
    $("#modelleme").validationEngine('detach'); 
    var kim = parseInt($(G).attr("id").substr(2))+1;
    var toplam = jQuery("#toplam").attr("value");
    for (i=kim; i<toplam; i++) {
        jQuery('#md'+i).html('-------');
    }
    var str = jQuery("#modelleme").serialize();
    str = str + '&action=colorsize&kac='+kim;
    jQuery.post('addCart.php',
        str,
        function (data) {
            $('#md'+kim).html(data);

            $("#modelleme").validationEngine('attach',{promptPosition:"topRight",scroll: false}); 
    });
}

function getcomments(id,type) {
    if(id){
        if(type!='comments') type='commwrite';
        $('#fullcomm').html('<div class="loading"><img src="images/ajax-loader.gif" /></div>');
        $.post('addCart.php',{'action':type,'id':id},function(data) {
                $('#fullcomm').html(data);
        });
    }
}

function payCard() {
    if($('#cardholder').validationEngine('validate')) {
        $("body").append('<div id="overlay"></div>');
        var html = '<div class="box"><div class="content"><img src="images/waiting.gif" /><br> Lütfen bekleyiniz...</div></div>';
        $("body").append(html);
        $(".box").center();
        $.post('checkout.php',$('#cardholder').serialize(),function(data){
                var json = eval('('+data+')');
                if(json.error==1) {
                    $('#message').html('<div class="nNote nFailure"><p><strong>'+json.message+'</strong></p></div>');
                    $('.box, #overlay').remove();
                }
                else
                    top.location.href = json.url;
        });
    }
}
function showPicture(v) {
    var form = $('#modelleme').serialize()+'&action=modelpicture';
    $.post('addCart.php',form,function(data) {
            var json = eval('('+data+')');
            if(json.val==1) {
                $('#modelresim').show();
                $('#modelresim').find('a').attr('href','modelpicture.php?id='+json.id);
                $(".iframe").fancybox({
                        maxWidth    : 800,
                        maxHeight    : 600,
                        fitToView    : true,
                        width        : '600',
                        height        : '400',
                        autoSize    : false,
                        closeClick    : false,
                        openEffect    : 'none',
                        closeEffect    : 'none'
                });
            }
            else
                {
                $('#modelresim').hide();
            }
    });

}
function dialogOpen() {
    $.fancybox({
            href:'checkout.php?'+$('#cardholder').serialize(),
            type: 'iframe'
    });
}
function payuOpen() {
    $('#cardholder').submit();
}

function ChangeProductPic(param,w)
{
    jQuery(".zooms").attr('href',param).children().attr({'src':param,'style':w});
}

function shareOnFacebook(t,u) 
{
    window.open('http://www.facebook.com/sharer.php?u=' + encodeURIComponent(u)+ '&t=' + encodeURIComponent(t) , 'sharer', 'toolbar=0,status=0,width=626,height=436'); return false;
}
function shareOnFriendFeed(t,u) 
{
    window.open('http://friendfeed.com/share/bookmarklet/frame#url=' + encodeURIComponent(u), 'sharer', 'toolbar=0,status=0,width=626,height=436'); return false;
}
function shareOnTwitter(t,u) 
{
    window.open('http://twitter.com/home?status=' + encodeURIComponent(u), 'sharer', 'toolbar=0,status=0,width=800,height=600'); return false;
}
function setCookie(c_name,value,expiredays)
{
    var exdate=new Date();
    exdate.setDate(exdate.getDate()+expiredays);
    document.cookie=c_name+ "=" +escape(value)+
    ((expiredays==null) ? "" : ";expires="+exdate.toUTCString())+";path=/";
    location=location.href;
}
function fblogin(){url = document.getElementById('fburl').value;  window.open(url, "", "width=600,height=400,top=200,left=200");}
function twlogin(){url = document.getElementById('twurl').value;  window.open(url, "", "width=600,height=400,top=200,left=200");}
jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", (($(window).height() - this.outerHeight()) / 2) + $(window).scrollTop() + "px");
    this.css("left", (($(window).width() - this.outerWidth()) / 2) + $(window).scrollLeft() + "px");
    return this;
}