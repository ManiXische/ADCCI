/***************************************************************************************************
Extension Name: \\ADCloud
File: component-ADCloud
Owner: Manikandan
Version: 1.0.0
***************************************************************************************************/

 
var checkExist = setInterval(function () {
    if ($(".ui-lib-global-csat-feedback-js-open-buttons").length) {
        $(".ui-lib-global-csat-feedback-js-open-buttons").attr('style',"top: calc(75% - 80px)")
      
        clearInterval(checkExist);
    }
}, 100);