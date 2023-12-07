$(document).ready(function () {

    // init scrollbars 
    // usage add "data-scrollbar" to your scroll div or container
    // and ignore IE 
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    if (msie < 0 && !navigator.userAgent.match(/Trident.*rv\:11\./) && !(/Edge/.test(navigator.userAgent))) // If Internet Explorer, return version number
    {
        (typeof Scrollbar != "undefined") && Scrollbar.initAll();
        // Scrollbar.init(document.querySelector('body'));   
    }

    function checkScrolled(){
        // add class on scroll 
        var scroll = $(window).scrollTop();
        var headerHeight = ($(".ex-announcement").outerHeight() || 0) + ($(".ex-header__wrapper").outerHeight() || 0);

        //>=, not <=
        var value = ($.extractValueFromStr && $.extractValueFromStr($("meta[name='scrolling']").attr("content") , "scroll-after")) || 5;
        if (scroll >= value) {
            //clearHeader, not clearheader - caps H
            $("body").addClass("scrolled");
        }else {
            $("body").removeClass("scrolled");
        }    
    }


    $(window).scroll(function(){
        checkScrolled();
    });
    checkScrolled();
});