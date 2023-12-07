/***************************************************************************************************
Extension Name: #{$ProjectName} 
File: Owl Initialize
Owner: Wael Gomaa
Version: 1.0.0
***************************************************************************************************/


$(document).ready(function(){

    if($.fn.owlCarousel){
        var instances = $("[data-carousel]");
        instances.each(function(idx , instance){

            // Getting items responsive count
            var itemslg = $(instance).data("items-lg") || 3,
            childs = $(instance).children(),
            itemsmd = $(instance).data("items-md") || 2,
            itemssm = $(instance).data("items-sm") || 1,
            itemsxs = $(instance).data("items-xs") || 1;

            // Controlling navigation 
            var enableNav = !!$(instance).data("nav"),
            preNavIcon = $(instance).data("nav-prev-icon") || 'icon-left-arrow' ,
            nextNavIcon = $(instance).data("nav-next-icon")|| 'icon-right-arrow';

            // margin between items
            var margin = $(instance).data("margin") || 10;

            // controlling dots 
            var enableDots = !!$(instance).data("dots");

            var autoplay = $(instance).data("autoplay") || true;
            var autoplayTimeout = $(instance).data("autoplayTimeout") || 4000;
            var autoplayHoverPause = $(instance).data("autoplayHoverPause") || false;
            var autoHeight = $(instance).data("autoHeight");

            var loop =  $(instance).data("loop") || false;

            $(instance).owlCarousel({
                margin : margin,
                nav : enableNav,
                autoHeight : !!autoHeight,
                navText : enableNav && ['<i class="'+ preNavIcon +'" aria-hidden="true"></i>','<i class="'+nextNavIcon+'" aria-hidden="true"></i>'],
                rtl: $("html").attr("lang") == "ar-AE",
                dots : enableDots,
                autoplay:autoplay,
                autoplayTimeout:autoplayTimeout,
                autoplayHoverPause:autoplayHoverPause,
                loop:loop,
                stagePadding: 0,
                responsive : {
                    0:{
                        items: childs.length > itemsxs ? itemsxs : childs.length,
                        nav:true
                    },
                    480 :{
                        items: childs.length > itemssm ? itemssm : childs.length,
                        nav:false
                    },
                    768 :{
                        items: childs.length > itemsmd ? itemsmd : childs.length,
                        nav:true,
                        loop:loop
                    },
                    1000 :{
                        items: childs.length > itemslg ? itemslg : childs.length,
                        nav:true,
                        loop:loop
                    }
                }
            });
            
        });
    }
  });