/***************************************************************************************************
Extension Name: \\ex-img-card
File: component-img-card
Owner: Mahmoud
Version: 1.0.0
***************************************************************************************************/

$(document).ready(function () {
    
    $(".ex-img-card-v2").hover(function(){
        $(this).find(".imgcard-title").each(function(){
            $(this).truncate();
        })
    });


});