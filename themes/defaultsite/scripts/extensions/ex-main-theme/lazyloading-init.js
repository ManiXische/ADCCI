/***************************************************************************************************
Extension Name: #{$ProjectName} 
File: lazyloading Initialize
Owner: Shaheen
Version: 1.0.0
***************************************************************************************************/

$(document).ready(function(){

    $('div[data-lazyload="true"]').find('div[data-src]').each(function() {
        $(this).each(function() {
            $(this).append("<img class='lazyload' data-src='"+ $(this).attr("data-src") +"'/>");
        });
    });
})