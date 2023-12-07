
// Burger Menu 
// =====================================
$( document ).ready(function() {
    // contrast & zoom options 
    var activeClass = "contrast-wrapper__btn--active";
    if(localStorage){
        let contrastValue = localStorage.getItem("contrast");

        if(contrastValue){
    
            $("html").addClass(contrastValue + '-contrast');
            $("[data-contrast]").each(function () {
                $(this).removeClass(activeClass).removeClass($(this).data("activeclass"));
            });
            $("[data-contrast='"+contrastValue+"']").each(function() {
                $(this).toggleClass($(this).data("activeclass") || activeClass)
            });
        }
    }

    $("[data-contrast]").click(function() {
        if(!$(this).hasClass(activeClass)){
            $("[data-contrast]").each(function () {
                $(this).removeClass(activeClass).removeClass($(this).data("activeclass"));
            });
            var contrast = $(this).data("contrast").trim() ;

            $("[data-contrast='"+contrast+"']").each(function() {
                $(this).toggleClass($(this).data("activeclass") || activeClass)
            });

            $("html").removeClass('high-contrast');
            $("html").removeClass('color-contrast');

            localStorage && localStorage.setItem("contrast" , contrast);
            $("html").addClass(contrast + '-contrast');
        }
        $( window ).trigger( "window-contrast-changed");
    });

    $("[data-zoom]").click(function() {
        var fontType = $(this).data("zoom");
        var currentZoom = parseInt($(document.body).attr("data-current-zoom") || 0);
        var activeClass = 'textsettings-wrapper__btn--active';
        var activeCSSClass = $(this).data("activeclass") ;

        var maxZoomIn = 2,
        minZoomOut = 2;

        if(!$(document.body).hasClass('zoom-'+fontType+'-x'+ minZoomOut) || !$(document.body).hasClass('zoom-'+ fontType +'-x' + maxZoomIn)){
            $(document.body).removeClass("zoom-origin-x0 zoom-in-x1 zoom-in-x2 zoom-out-x1 zoom-out-x2");
            if(fontType == "in"){
                currentZoom ++;
                if(currentZoom < 0){
                    fontType = "out";
                }
            }else if(fontType == "out"){
                currentZoom --;
                if(currentZoom > 0){
                    fontType = "in";
                }
            }else {
                fontType = "origin";
                currentZoom = 0;
            }

            $(document.body).attr("data-current-zoom" , currentZoom).addClass('zoom-'+ (Math.abs(currentZoom) ? fontType : 'origin') + '-x' + Math.abs(currentZoom));

            if(currentZoom == 0){
                fontType = "origin";
            }
           
            // make default selected if the status now is 0
            $('.' + (activeCSSClass || activeClass)).removeClass((activeCSSClass || activeClass));
            $('[data-zoom="'+fontType+'"]').toggleClass((activeCSSClass || activeClass));
        }

        $( window ).trigger( "window-zoom-changed");

    });      
});