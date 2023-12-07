$(document).ready(function() {
    // handle slick progress bar
    var baseClasshighlights = '.ex-image-highlights';
    
    // check scrolled page or not
    if($(baseClasshighlights).hasClass(baseClasshighlights.replace("." , "") + "-v2")){
        $("body").addClass("secondary-highlight");
    }
    function checkScrolled (){
        var headerHeight = ($(".ex-announcement").outerHeight() || 0) + ($(".ex-header__wrapper").outerHeight() || 0);
        
        // hide the header 
        var scroll = $(window).scrollTop();
        var value = ($.extractValueFromStr && $.extractValueFromStr($("meta[name='scrolling']").attr("content") , "scroll-after")) || 5;

        if (scroll < headerHeight + value) {
            $(".ex-header").removeAttr("style");
        }

        if (scroll >= headerHeight + value) {
            $(".ex-header").css({
                "height" : "0"
            });
        }
        if (scroll >= headerHeight + value) {
            $(".ex-header").css({
                "height" : headerHeight + "px",
                "position" : "fixed"
            });
        }
        
        if ($("body").hasClass("scrolled")) {
            // $(".ex-header__right-section__upper-navigation-menu").attr('style','display: none !important');
            $(".ex-header__left-section").find(".ex-header__left-section__logo-menu").addClass("d-flex");
            // $(".ex-header__center").replaceClass("d-none" , "d-flex");
        }else {
            // $(".ex-header__right-section__upper-navigation-menu").removeAttr('style');
            $(".ex-header__left-section").find(".ex-header__left-section__logo-menu").removeClass("d-flex");
            // $(".ex-header__center").replaceClass("d-flex" , "d-none");
        }
    }
    $(window).scroll(function(){
        checkScrolled();
    });
    
    checkScrolled();
});