/***************************************************************************************************
Extension Name: \\ex-sxa-components
File: component-sxa-components
Owner: tawfik
Version: 1.0.0
***************************************************************************************************/

$(document).ready(function() {
    if($('.ex-sxa-components table').length){
        $('.ex-sxa-components table').wrap( "<div class='table-responsive'></div>" );
    }

    if($.fn.fancybox){
        $(".ex-sxa-components img.fancy-image , .ex-sxa-components .fancy-image img").each( function(idx, img) {
            let clonedImage = $(img).clone();
            clonedImage.hide().insertAfter($(img));

            $(clonedImage).fancybox({
                touch : false,
              
                afterLoad : function(){
                    $(".fancybox-content").css({
                        'background': 'transparent',
                        "padding": "0px",
                    });
                }, 
                afterShow : function(){
                    $(".fancybox-close-small").css({
                        "margin" : "0 11px",
                        "color" : "#ccc",
                        "position": "fixed"
                    });
                }, 
                onInit : function(){
                },
                afterClose : function(){
                }
            });
            $(img).on("click", function(){
                $(clonedImage).click();
            });
            
        });
    }
});
 
$(".facet-date-range").on("click", function () {

    $(document).ajaxComplete(function () {
        if ($('.ex-sxa-filter').length >= 1) {
        $('.ex-sxa-filter').addClass("ex-sxa-filter-active");
        
        $(".ex-sxa-filter__input .bottom-remove-filter button").on("click", function () {
            setTimeout(function () {
            $('.ex-sxa-filter').removeClass("ex-sxa-filter-active");
            }, 600)
        });
        
        }
    });
});