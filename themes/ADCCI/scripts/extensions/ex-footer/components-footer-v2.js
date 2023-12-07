/***************************************************************************************************
Extension Name: #{$ProjectName} 
File: Footer v2
Owner: Wael Gomaa
Version: 1.0.0
***************************************************************************************************/

$(document).ready(function () {
    var selector = ".ex-footer-v2";
    var activeAccordionClass = 'accordion__item--opened';
    var originalHeight;
    $(selector).find(".accordion__item").on("click" , function(){
        var ul = $(this).find("ul").parent();
        !originalHeight && (originalHeight = $(this).outerHeight());

        // close all opened 
        $("." + activeAccordionClass).animate({ height : originalHeight} , 300 , function(){
            $(this).toggleClass(activeAccordionClass);
        });

        // toggle this one if not opened 
        if(!$(this).hasClass(activeAccordionClass)){         
            $(this).animate({ height : ul.outerHeight() + $(this).outerHeight()} , 300,  function(){
                $(this).toggleClass(activeAccordionClass);
            });
        }
    });
    
});